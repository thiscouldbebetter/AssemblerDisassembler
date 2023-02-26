
class Opcode
{
	constructor(value, description)
	{
		this.value = value;
		this.description = description || "";
	}

	instructionSizeInBytes(instructionSet, instruction)
	{
		var bitStreamDummy = new BitStream();
		this.instructionWriteToBitStream
		(
			instructionSet, instruction, bitStreamDummy
		);
		var returnSize = bitStreamDummy.bytes.length;
		return returnSize;
	}

	instructionWriteToBitStream(instructionSet, instruction, bitStream)
	{
		if (this.value == "data") // hack
		{
			var operand = instruction.operands[0];
			bitStream.writeAlignOnBoundary(16);
			bitStream.writeString(operand.value);
		}
		else if (this.value == "label") // hack
		{
			// Don't write anything.
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

	operandsReadFromBitStream(bitStream)
	{
		return this.group.operandsReadForOpcodeFromBitStream(this, bitStream);
	}
}
