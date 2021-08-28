
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
		var instructionsAsStrings = assemblyCode.split(newline);
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

	toStringAssemblyCode()
	{
		var newline = "\n";
		var returnValue = this.instructions.join(newline);
		return returnValue;
	}
}
