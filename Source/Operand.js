
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

	isLabel()
	{
		var role = this.operandType.role;
		var returnValue =
			(role == OperandRole.Instances().LabelName);
		return returnValue;
	}

	toString()
	{
		return this.value;
	}

	// BitStream.

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