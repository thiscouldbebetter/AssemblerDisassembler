
class Instruction //
{
	constructor(opcode, operands)
	{
		this.opcode = opcode;
		this.operands = operands;

		this.offsetInBytes = null;
	}

	clone()
	{
		return new Instruction(this.opcode, this.operands.map(x => x.clone()));
	}

	operandsReverse()
	{
		this.operands = this.operands.reverse();
		return this;
	}

	sizeInBytes(instructionSet)
	{
		return this.opcode.instructionSizeInBytes(instructionSet, this);
	}

	toString()
	{
		var opcodeAsString =
			(this.opcode == null ? "???" : this.opcode.toString());

		var operandsAsString =
			this.operands.map(x => x.toString()).join(", ");

		var returnValue =
			opcodeAsString + " " + operandsAsString; 

		return returnValue;
	}

	writeToBitStreamForInstructionSet(bitStream, instructionSet)
	{
		this.opcode.instructionWriteToBitStream(instructionSet, this, bitStream);
	}
}
