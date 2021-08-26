
class InstructionOpcode
{
	constructor
	(
		mnemonic,
		value,
		operandsReadFromBitStream,
		description
	)
	{
		this.mnemonic = mnemonic;
		this.value = value;
		this._operandsReadFromBitStream =
			operandsReadFromBitStream;
		this.description = description || "";
	}

	static Instances()
	{
		if (InstructionOpcode._instances == null)
		{
			InstructionOpcode._instances =
				new InstructionOpcode_Instances();
		}
		return InstructionOpcode._instances;
	}

	operandsReadFromBitStream(bitStream)
	{
		var operands = null;

		if (this._operandsReadFromBitStream == null)
		{
			throw("Not yet implemented!");
		}
		else
		{
			operands = this._operandsReadFromBitStream(bitStream);
		}

		return operands;
	}

	toString()
	{
		return this.mnemonic.split("_")[0];
	}
}
