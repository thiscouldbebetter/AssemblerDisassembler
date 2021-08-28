
class InstructionOpcode
{
	constructor
	(
		mnemonic,
		value,
		operandsReadFromBitStream,
		instructionWriteToBitStream,
		description
	)
	{
		this.mnemonic = mnemonic;
		this.value = value;
		this._operandsReadFromBitStream =
			operandsReadFromBitStream;
		this.instructionWriteToBitStream =
			instructionWriteToBitStream;
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

	instructionWriteToBitStream(bitStream)
	{
		if (this._instructionWriteToBitStream == null)
		{
			throw("Not yet implemented!");
		}
		else
		{
			this._instructionWriteToBitStream(this, bitStream);
		}
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
