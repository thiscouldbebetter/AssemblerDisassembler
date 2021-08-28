
class InstructionSet
{
	constructor(name, opcodes)
	{
		this.name = name;
		this.opcodes = opcodes;
		this._opcodesByValue = new Map(this.opcodes.map(x => [x.value, x]));
	}

	static Instances()
	{
		if (InstructionSet._instances == null)
		{
			InstructionSet._instances = new InstructionSet_Instances();
		}
		return InstructionSet._instances;
	}

	static byName(name)
	{
		return InstructionSet.Instances().byName(name);
	}

	opcodeByValue(opcodeValue)
	{
		return this._opcodesByValue.get(opcodeValue);
	}
}

class InstructionSet_Instances
{
	constructor()
	{
		
		this.x86 = InstructionSet_x86.build();

		this._All =
		[
			this.x86
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x]));
	}

	byName(name)
	{
		return this._AllByName.get(name);
	}
}