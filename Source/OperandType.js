
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

	static fromRoleAndSize(role, size)
	{
		return new OperandType(role, size);
	}

	operandToStringAssemblyCode(operand)
	{
		return this.role.operandToStringAssemblyCode(operand);
	}

	writeToBitStream(bitStream)
	{
		this.role.writeToBitStream(bitStream);
	}

	writeOperandToBitStream(operand, bitStream)
	{
		var operandValueAsInteger =
			this.role.operandToInteger(operand);
		var bitWidth = this.size.sizeInBits;
		bitStream.writeIntegerUsingBitWidth
		(
			operandValueAsInteger, bitWidth
		);
	}
}