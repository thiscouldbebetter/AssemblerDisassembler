
class OperandType
{
	constructor(name, code)
	{
		this.name = name;
		this.code = code;
	}

	static Instances()
	{
		if (OperandType._instances == null)
		{
			OperandType._instances = new OperandType_Instances();
		}
		return OperandType._instances;
	}

	static byName(operandTypeName)
	{
		return OperandType.Instances().byName(operandTypeName);
	}

	static fromOperandAsString(operandAsString)
	{
		var returnValue = null;

		var operandTypeInstances = OperandType.Instances();

		if (operandAsString.startsWith("["))
		{
			if (operandAsString.indexOf("+") < 0)
			{
				returnValue = operandTypeInstances.MemoryAtAddressInRegister;
			}
			else
			{
				returnValue = operandTypeInstances.MemoryAtAddressInRegisterPlusOffset;
			}
		}
		else
		{
			returnValue = operandTypeInstances.RegisterContents;
		}

		return returnValue;
	}
}

class OperandType_Instances
{
	constructor()
	{
		this.RegisterContents =
			new OperandType("RegisterContents", "r");
		this.MemoryAtAddressInRegister =
			new OperandType("MemoryAtAddressInRegister", "rm");
		this.MemoryAtAddressInRegisterPlusOffset =
			new OperandType("MemoryAtAddressInRegisterPlusOffset", "rm");

		this._All =
		[
			this.RegisterContents,
			this.MemoryAtAddressInRegister,
			this.MemoryAtAddressInRegisterPlusOffset
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x]));
	}

	byName(operandTypeName)
	{
		return this._AllByName.get(operandTypeName);
	}
}