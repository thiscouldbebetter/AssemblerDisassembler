
class Instruction //
{
	constructor(opcode, operands)
	{
		this.opcode = opcode;
		this.operands = operands;
	}

	clone()
	{
		return new Instruction(this.opcode, this.operands.map(x => x));
	}

	operandsReverse()
	{
		this.operands = this.operands.reverse();
		return this;
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
		bitStream.writeIntegerUsingBitWidth
		(
			this.opcode.value,
			instructionSet.opcodeWidthInBits
		);
		this.opcode.instructionWriteToBitStream(this, bitStream);
	}
}
