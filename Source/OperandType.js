
class OperandType
{
	constructor(role, size)
	{
		this.role = role;
		this.size = size;
	}

	static fromOperandAsString(operandAsString)
	{
		var role = OperandRole.fromOperandAsString(operandAsString);
		var size = OperandSize.fromOperandAsString(operandAsString);

		var returnType = new OperandType(role, size);

		return returnType;
	}

	writeToBitStream(bitStream)
	{
		this.role.writeToBitStream(bitStream);
	}

	writeOperandValueToBitStream(operandValue, bitStream)
	{
		this.size.writeOperandValueToBitStream(operandValue, bitStream);
	}
}