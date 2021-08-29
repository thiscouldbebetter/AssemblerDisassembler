
class Opcode
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
		this._instructionWriteToBitStream =
			instructionWriteToBitStream;
		this.description = description || "";
	}

	static Instances()
	{
		if (Opcode._instances == null)
		{
			Opcode._instances =
				new Opcode_Instances();
		}
		return Opcode._instances;
	}

	instructionWriteToBitStream(instruction, bitStream)
	{
		if (this._instructionWriteToBitStream == null)
		{
			throw("Not yet implemented!");
		}
		else
		{
			this._instructionWriteToBitStream(instruction, bitStream);
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
