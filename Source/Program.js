
class Program
{
	constructor(name, instructionSetName, instructions)
	{
		this.name = name;
		this.instructionSetName = instructionSetName;
		this.instructions = instructions;
	}

	static fromAssemblyCode(name, instructionSetName, assemblyCode)
	{
		var instructionSet =
			InstructionSet.byName(instructionSetName);

		// Split the code into lines and remove blanks.

		var newline = "\n";
		var instructionsAsStrings = assemblyCode.split(newline).map
		(
			x => x.trim()
		).filter
		(
			y => y.length > 0
		);

		// Parse instructions.

		var instructions = instructionsAsStrings.map
		(
			x => instructionSet.instructionFromAssemblyCode(x)
		);

		// Calculate offsets of instructions and labels.

		var programSizeInBytesSoFar = 0;

		instructions.forEach(instruction =>
		{
			instruction.offsetInBytes = programSizeInBytesSoFar;
			var instructionSizeInBytes =
				instruction.sizeInBytes(instructionSet);
			programSizeInBytesSoFar += instructionSizeInBytes;
		});

		// Get labels.

		var instructionsForLabels =
			instructions.filter(x => x.opcode.value == "label");
		var instructionsForLabelsByName = new Map
		(
			instructionsForLabels.map(x => [x.operands[0].value, x])
		);

		// Loop through the program several times, 
		// "compressing" jump instructions each time,
		// until no more compression is needed.

		var programSizeInBytesPrev = 0;

		var operandRoleLabelName = OperandRole.Instances().LabelName;

		while (programSizeInBytesSoFar != programSizeInBytesPrev)
		{
			programSizeInBytesPrev = programSizeInBytesSoFar;
			programSizeInBytesSoFar = 0;

			instructions.forEach(instruction =>
			{
				instruction.offsetInBytes = programSizeInBytesSoFar;

				var opcode = instruction.opcode;
				var opcodeGroup = opcode.group;
				if (opcodeGroup != null && instruction.doOperandsIncludeLabel())
				{
					var operands = instruction.operands;
					for (var i = 0; i < operands.length; i++)
					{
						var operand = operands[i];
						if (operand.isLabel())
						{
							var labelNameToJumpTo = operand.value;
							var labelInstructionToJumpTo =
								instructionsForLabelsByName.get(labelNameToJumpTo);
							var addressToJumpToAbsolute =
								labelInstructionToJumpTo.offsetInBytes;
							var addressToJumpToRelative =
								addressToJumpToAbsolute - instruction.offsetInBytes;

							if (addressToJumpToRelative >= -127 && addressToJumpToRelative <= 128)
							{
								// It fits in a single byte.
								operandDestination.operandType.size.sizeInBits = 8;
								instruction.opcode = opcodeGroup.opcodes[2]; // hack
							}
						}
					}
				}

				var instructionSizeInBytes =
					instruction.sizeInBytes(instructionSet);
				programSizeInBytesSoFar += instructionSizeInBytes;
			});
		}

		// Remove any labels.

		instructions = instructions.filter
		(
			x => x.opcode.value != "label"
		);

		// Resolve labels to numeric addresses or offsets.

		instructions.forEach(instruction =>
		{
			if (instruction.doOperandsIncludeLabel())
			{
				var operands = instruction.operands;
				for (var i = 0; i < operands.length; i++)
				{
					var operand = operands[i];
					if (operand.isLabel())
					{
						var labelNameToJumpTo = operand.value;
						var labelInstructionToJumpTo =
							instructionsForLabelsByName.get(labelNameToJumpTo);
						var addressToJumpToAbsolute =
							labelInstructionToJumpTo.offsetInBytes;
						var instructionSizeInBytes =
							instruction.sizeInBytes(instructionSet);
						var addressToJumpToRelative =
							addressToJumpToAbsolute
							- instruction.offsetInBytes
							- instructionSizeInBytes;
						operand.value = addressToJumpToRelative;
					}
				}
			}
		});

		var returnValue =
			new Program(name, instructionSetName, instructions);

		return returnValue;
	}

	static fromBytes(name, instructionSetName, bytes)
	{
		var instructionSet =
			InstructionSet.byName(instructionSetName);

		var bitStream = new BitStream(bytes);

		var instructions = [];

		while (bitStream.hasMoreBits())
		{
			var instruction =
				instructionSet.instructionReadFromBitStream(bitStream);
			instructions.push(instruction);
		}

		var returnValue =
			new Program(name, instructionSetName, instructions);

		return returnValue;
	}

	instructionSet()
	{
		return InstructionSet.byName(this.instructionSetName);
	}

	toBytes()
	{
		var bitStream = new BitStream();
		var instructionSet = this.instructionSet();

		for (var i = 0; i < this.instructions.length; i++)
		{
			var instruction = this.instructions[i];
			instruction.writeToBitStreamForInstructionSet
			(
				bitStream, instructionSet
			);
		}

		var returnBytes = bitStream.bytes;

		return returnBytes;
	}

	toStringAssemblyCode()
	{
		var newline = "\n";
		var returnValue = this.instructions.join(newline);
		return returnValue;
	}
}
