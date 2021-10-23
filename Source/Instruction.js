
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

	doOperandsIncludeLabel()
	{
		var returnValue =
			this.operands.some(x => x.isLabel());
		return returnValue;
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

	toStringAssemblyCode()
	{
		var opcodeAsString =
			(this.opcode == null ? "???" : this.opcode.group.mnemonic);

		var operandsAsString =
			this.operands.map(x => x.toStringAssemblyCode()).join(", ");

		var returnValue =
			opcodeAsString + " " + operandsAsString; 

		return returnValue;
	}

	writeToBitStreamForInstructionSet(bitStream, instructionSet)
	{
		this.opcode.instructionWriteToBitStream(instructionSet, this, bitStream);
	}
}
