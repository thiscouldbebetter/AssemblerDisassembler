
class InstructionSet
{
	constructor
	(
		name,
		opcodeWidthInBits,
		opcodeGroups,
		instructionFromAssemblyCode,
		instructionReadFromBitStream
	)
	{
		this.name = name;
		this.opcodeWidthInBits = opcodeWidthInBits;
		this.opcodeGroups = opcodeGroups;
		this._instructionFromAssemblyCode = instructionFromAssemblyCode;
		this._instructionReadFromBitStream = instructionReadFromBitStream;

		this._opcodeGroupsByMnemonic = new Map
		(
			this.opcodeGroups.map(x => [x.mnemonic, x])
		);

		this._opcodesByValue = new Map();
		this.opcodeGroups.forEach(opcodeGroup =>
		{
			opcodeGroup.opcodes.forEach
			(
				opcode => this._opcodesByValue.set(opcode.value, opcode)
			);
		});
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
			throw new Error("Not yet implemented!");
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
			throw new Error("Not yet implemented!");
		}
		else
		{
			instructionRead =
				this._instructionReadFromBitStream(this, bitStream);
		}

		return instructionRead;
	}

	opcodeGroupByMnemonic(opcodeGroupMnemonic)
	{
		return this._opcodeGroupsByMnemonic.get(opcodeGroupMnemonic);
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
		
		this.x86 = InstructionSet_x86_16.build();

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