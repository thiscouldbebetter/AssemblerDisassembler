
class AddressingMode
{
	// hack - This class assumes the x86 instruction set.

	constructor(name, code)
	{
		this.name = name;
		this.code = code;
	}

	static Instances()
	{
		if (AddressingMode._instances == null)
		{
			AddressingMode._instances =
				new AddressingMode_Instances();
		}
		return AddressingMode._instances;
	}

	static byCode(code)
	{
		return AddressingMode.Instances().byCode(code);
	}
}

class AddressingMode_Instances
{
	constructor()
	{
		this.Default = new AddressingMode("Default", 0);

		this.Memory = new AddressingMode("Memory", 0);
		this.MemoryPlusOffset = new AddressingMode("MemoryPlusOffset", 2);
		this.Register = new AddressingMode("Register", 1);

		this._All =
		[
			this.Default,

			this.Memory,
			this.MemoryPlusOffset,
			this.Register
		];

		this._AllByCode =
			new Map(this._All.map(x => [x.code, x]));
	}

	byCode(code)
	{
		return this._AllByCode.get(code);
	}
}
