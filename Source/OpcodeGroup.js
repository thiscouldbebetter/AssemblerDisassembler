
class OpcodeGroup
{
	constructor
	(
		mnemonic,
		operandsIncludeLabel,
		opcodeValueFromOperands,
		operandsReadFromBitStream,
		instructionOperandsWriteToBitStream,
		opcodes
	)
	{
		this.mnemonic = mnemonic;
		this.operandsIncludeLabel = operandsIncludeLabel;
		this._opcodeValueFromOperands = opcodeValueFromOperands;
		this._operandsReadFromBitStream = operandsReadFromBitStream;
		this._instructionOperandsWriteToBitStream =
			instructionOperandsWriteToBitStream;

		this.opcodes = opcodes;

		this.opcodes.forEach(x => x.group = this);
		this._opcodesByValue = new Map(this.opcodes.map(x => [x.value, x]));
	}

	opcodeByValue(opcodeValue)
	{
		return this._opcodesByValue.get(opcodeValue);
	}

	opcodeFromOperands(operands)
	{
		var opcodeValue = this._opcodeValueFromOperands(operands);
		var opcode = this.opcodeByValue(opcodeValue);
		if (opcode == null)
		{
this._opcodeValueFromOperands(operands);
			throw("Opcode could not be determined from operands!")
		}
		return opcode;
	}

	operandsReadFromBitStream(bitStream)
	{
		return this._operandsReadFromBitStream(bitStream);
	}

	instructionOperandsWriteToBitStream(instruction, bitStream)
	{
		this._instructionOperandsWriteToBitStream(instruction, bitStream);
	}

}