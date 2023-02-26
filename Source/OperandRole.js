
class OperandRole
{
	constructor
	(
		name,
		code,
		operandToStringAssemblyCode,
		operandToInteger
	)
	{
		this.name = name;
		this.code = code;
		this._operandToStringAssemblyCode =
			operandToStringAssemblyCode;
		this._operandToInteger = operandToInteger;
	}

	static fromNameCodeOperandToStringAndInteger
	(
		name, code, operandToStringAssemblyCode, operandToInteger
	)
	{
		return new OperandRole
		(
			name, code, operandToStringAssemblyCode, operandToInteger
		);
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

	operandToStringAssemblyCode(operand)
	{
		return this._operandToStringAssemblyCode(operand);
	}

	operandToInteger(operand)
	{
		return this._operandToInteger(operand);
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
		this.Data = new OperandRole
		(
			"Data",
			"d",
			(operand) => { throw new Error("todo - OperandRole - Data"); },
			(operand) => { throw new Error("todo - OperandRole - Data"); }
		);
		this.Immediate = new OperandRole
		(
			"Immediate",
			"i",
			(operand) =>
			{
				return operand.value;
			},
			(operand) => { throw new Error("todo - OperandRole - Immediate"); }
		);
		this.LabelName = new OperandRole
		(
			"LabelName",
			"l",
			(operand) => { throw new Error("todo - OperandRole - LabelName"); },
			(operand) => { throw new Error("todo - OperandRole - LabelName"); }
		);
		this.RegisterContents = new OperandRole
		(
			"RegisterContents",
			"r",
			(operand) =>
			{
				return operand.value.name;
			},
			(operand) =>
			{
				return operand.value.code;
			}
		);
		this.MemoryAtAddressInRegister = new OperandRole
		(
			"MemoryAtAddressInRegister",
			"rm",
			(operand) => { throw new Error("todo - OperandRole - MemoryAtAddressInRegister"); },
			(operand) => { throw new Error("todo - OperandRole - MemoryAtAddressInRegister"); }
		);
		this.MemoryAtAddressInRegisterPlusOffset = new OperandRole
		(
			"MemoryAtAddressInRegisterPlusOffset",
			"rm",
			(operand) => { throw new Error("todo - OperandRole - MemoryAtAddressInRegisterPlusOffset"); },
			(operand) => { throw new Error("todo - OperandRole - MemoryAtAddressInRegisterPlusOffset"); }
		);

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