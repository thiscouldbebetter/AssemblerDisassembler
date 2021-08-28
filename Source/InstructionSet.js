
class InstructionSet
{
	constructor
	(
		name,
		opcodes,
		instructionFromAssemblyCode,
		instructionReadFromBitStream
	)
	{
		this.name = name;
		this.opcodes = opcodes;
		this._instructionFromAssemblyCode = instructionFromAssemblyCode;
		this._instructionReadFromBitStream = instructionReadFromBitStream;

		this._opcodesByMnemonic = new Map
		(
			this.opcodes.map(x => [x.mnemonic, x])
		);

		this._opcodesByValue = new Map
		(
			this.opcodes.map(x => [x.value, x])
		);
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

	instructionFromAssemblyCode(assemblyCode)
	{
		var instructionRead = null;

		if (this._instructionFromAssemblyCode == null)
		{
			throw("Not yet implemented!");
		}
		else
		{
			instructionRead =
				this._instructionFromAssemblyCode(this, assemblyCode);
		}

		return instructionRead;
	}

	instructionReadFromBitStream(bitStream)
	{
		var instructionRead = null;

		if (this._instructionReadFromBitStream == null)
		{
			throw("Not yet implemented!");
		}
		else
		{
			instructionRead =
				this._instructionReadFromBitStream(this, bitStream);
		}

		return instructionRead;
	}

	opcodeByMnemonic(opcodeMnemonic)
	{
		return this._opcodesByMnemonic.get(opcodeMnemonic);
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