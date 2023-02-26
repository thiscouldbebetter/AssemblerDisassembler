
class Operand
{
	constructor(operandType, value)
	{
		this.operandType = operandType;
		this.value = value;
	}

	static fromTypeAndValue(operandType, value)
	{
		return new Operand(operandType, value);
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

	toStringAssemblyCode()
	{
		return this.operandType.operandToStringAssemblyCode(this);
	}

	// BitStream.

	readFromBitStream(bitStream)
	{
		throw new Error("todo");
	}

	writeToBitStream(bitStream)
	{
		var type = this.operandType;
		type.writeOperandToBitStream(this, bitStream);
	}
}