
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

		var newline = "\n";
		var instructionsAsStrings = assemblyCode.split(newline).map
		(
			x => x.trim()
		).filter
		(
			y => y.length > 0
		);
		var instructions = instructionsAsStrings.map
		(
			x => instructionSet.instructionFromAssemblyCode(x)
		);
		
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
