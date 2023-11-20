
class InstructionSet_Mos6502
{
	// Adapted from listings found at the following URLs:
	// https://en.wikipedia.org/wiki/6502#Instructions_and_opcodes

	static build()
	{
		var opcodeGroups =
		[
			new OpcodeGroup
			(
				"todo",
				(opds) => { throw new Error("todo"); },
				() => { throw new Error("todo"); },
				(ins, bs) => { throw new Error("todo"); },
				[
					new Opcode("0xWhatever", "description"),
				]
			),
		];

		var instructionSet = new InstructionSet
		(
			"MOS 6502",
			8, // opcodeWidthInBits
			opcodeGroups,
			InstructionSet_Mos6502.instructionFromAssemblyCode,
			InstructionSet_Mos6502.instructionReadFromBitStream
		);

		return instructionSet;
	}

	static instructionFromAssemblyCode
	(
		instructionSet, assemblyCode
	)
	{
		throw new Error("todo");

		// What's here is the stuff for x86-16.

		var commentDelimiter = ";"
		assemblyCode = assemblyCode.split(commentDelimiter)[0];
		if (assemblyCode.trim() == "")
		{
			return null;
		}

		var mnemonicAndOperands =
			assemblyCode.split(",").join(" ").split(" ").filter(x => x != ""); 

		var mnemonic = mnemonicAndOperands[0];

		var opcode = null;
		var operands = null;

		if (mnemonic == "db" || mnemonic == "dw")
		{
			opcode = new Opcode("data"); // hack
			var dataToWriteAsString = "";

			var operandsAsString = assemblyCode.substr(mnemonic.length + 1);
			var operandsAsStrings = operandsAsString.split(","); // todo - Commas in quotes.

			for (var i = 0; i < operandsAsStrings.length; i++)
			{
				var operand = operandsAsStrings[i];
				var operandIsQuotedString = operand.startsWith("'");
				if (operandIsQuotedString)
				{
					operand = operand.split("'").join("");
					dataToWriteAsString += operand;
				}
				else
				{
					var operandAsInteger = parseInt(operand);
					var operandAsCharacter = String.fromCharCode(operandAsInteger);
					dataToWriteAsString += operandAsCharacter;
				}
			}
			var operandRole = OperandRole.Instances().Data;
			var operandSize = OperandSize.fromNameAndSizeInBits
			(
				"data", dataToWriteAsString.length
			);
			var operandType =
				OperandType.fromRoleAndSize(operandRole, operandSize);
			var operand = Operand.fromTypeAndValue(operandType, dataToWriteAsString);
			operands = [ operand ];
		}
		else if (mnemonic.endsWith(":"))
		{
			opcode = new Opcode("label"); // hack

			var labelName = mnemonic.substr(0, mnemonic.length - 1);

			var operandRole = OperandRole.Instances().LabelName;
			var operandSizeInBytesAssumed = 2;
			var operandSize = OperandSize.fromNameAndSizeInBits
			(
				"label", operandSizeInBytesAssumed
			);
			var operandType =
				OperandType.fromRoleAndSize(operandRole, operandSize);
			var operand = Operand.fromTypeAndValue(operandType, labelName);
			operands = [ operand ];
		}
		else
		{
			var operandsAsStrings = mnemonicAndOperands.slice(1);
			operandsAsStrings = operandsAsStrings.filter(x => x != null);

			operands = operandsAsStrings.map
			(
				x => InstructionSet_x86_16.operandFromString(x)
			);

			var opcodeGroup =
				instructionSet.opcodeGroupByMnemonic(mnemonic);

			if (opcodeGroup == null)
			{
				throw new Error("Unrecognized mnemonic: " + mnemonic);
			}

			var opcode = opcodeGroup.opcodeFromOperands(operands);
		}

		var instruction = new Instruction(opcode, operands);

		return instruction;
	}

	static instructionReadFromBitStream(instructionSet, bitStream)
	{
		throw new Error("todo");

		// What's here is the stuff for x86-16.

		var opcodeValue = bitStream.readByte();

		var opcode = instructionSet.opcodeByValue(opcodeValue);
		var operands = null;

		if (opcode == null)
		{
			var opcodeValueAsHex = opcodeValue.toString("16");
			opcode = new InstructionOpcode
			(
				"_" + opcodeValueAsHex, opcodeValue, "[unrecognized]"
			);
		}
		else
		{
			operands =
				opcode.operandsReadFromBitStream(bitStream);
		}

		var instruction = new Instruction(opcode, operands);

		return instruction;
	}
}
