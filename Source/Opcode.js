
class Opcode
{
	constructor(value, description)
	{
		this.value = value;
		this.description = description || "";
	}

	instructionWriteToBitStream(instructionSet, instruction, bitStream)
	{
		if (this.value == "data") // hack
		{
			var operand = instruction.operands[0];
			bitStream.writeAlignOnBoundary(16);
			bitStream.writeString(operand.value);
		}
		else
		{
			bitStream.writeIntegerUsingBitWidth
			(
				this.value,
				instructionSet.opcodeWidthInBits
			);
			this.group.instructionOperandsWriteToBitStream
			(
				instruction, bitStream
			);
		}
	}
}
