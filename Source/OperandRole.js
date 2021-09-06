
class OperandRole
{
	constructor(name, code)
	{
		this.name = name;
		this.code = code;
	}

	static Instances()
	{
		if (OperandRole._instances == null)
		{
			OperandRole._instances = new OperandRole_Instances();
		}
		return OperandRole._instances;
	}

	static byName(OperandRoleName)
	{
		return OperandRole.Instances().byName(OperandRoleName);
	}

	static fromOperandAsString(operandAsString)
	{
		var returnValue = null;

		var operandRoleInstances = OperandRole.Instances();

		if (operandAsString.startsWith("["))
		{
			if (operandAsString.indexOf("+") < 0)
			{
				returnValue = operandRoleInstances.MemoryAtAddressInRegister;
			}
			else
			{
				returnValue = operandRoleInstances.MemoryAtAddressInRegisterPlusOffset;
			}
		}
		else if (isNaN(operandAsString))
		{
			returnValue = operandRoleInstances.RegisterContents;
		}
		else
		{
			returnValue = operandRoleInstances.Immediate;
		}

		return returnValue;
	}

	writeToBitStream(bitStream)
	{
		// todo
		bitStream.writeBit(1);
	}
}

class OperandRole_Instances
{
	constructor()
	{
		this.Data = new OperandRole("Data", "d");
		this.Immediate =
			new OperandRole("Immediate", "i");
		this.LabelName = new OperandRole("LabelName", "l");
		this.RegisterContents =
			new OperandRole("RegisterContents", "r");
		this.MemoryAtAddressInRegister =
			new OperandRole("MemoryAtAddressInRegister", "rm");
		this.MemoryAtAddressInRegisterPlusOffset =
			new OperandRole("MemoryAtAddressInRegisterPlusOffset", "rm");

		this._All =
		[
			this.Data,
			this.Immediate,
			this.LabelName,
			this.RegisterContents,
			this.MemoryAtAddressInRegister,
			this.MemoryAtAddressInRegisterPlusOffset
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x]));
	}

	byName(OperandRoleName)
	{
		return this._AllByName.get(OperandRoleName);
	}
}