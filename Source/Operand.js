
class Operand
{
	constructor(operandType, value)
	{
		this.operandType = operandType;
		this.value = value;
	}

	clone()
	{
		return new Operand(this.operandType, this.value);
	}

	toString()
	{
		return this.value;
	}

	readFromBitStream(bitStream)
	{
		throw("todo");
	}

	writeToBitStream(bitStream)
	{
		var type = this.operandType;
		type.writeOperandValueToBitStream(this.value, bitStream);
	}
}