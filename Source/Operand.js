
class Operand
{
	constructor(operandTypeName, value)
	{
		this.operandTypeName = operandTypeName;
		this.value = value;
	}

	static fromString(operandAsString)
	{
		var operandType =
			OperandType.fromOperandAsString(operandAsString);

		return new Operand
		(
			operandType.name,
			operandAsString
		);
	}

	clone()
	{
		return new Operand(this.operandTypeName, this.value);
	}

	toString()
	{
		return this.value;
	}

	type()
	{
		return OperandType.byName(this.operandTypeName);
	}
}