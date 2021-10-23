
class OpcodeGroup
{
	constructor
	(
		mnemonic,
		opcodeValueFromOperands,
		operandsReadForOpcodeFromBitStream,
		instructionOperandsWriteToBitStream,
		opcodes
	)
	{
		this.mnemonic = mnemonic;
		this._opcodeValueFromOperands = opcodeValueFromOperands;
		this._operandsReadForOpcodeFromBitStream =
			operandsReadForOpcodeFromBitStream;
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
			throw new Error("Opcode could not be determined from operands!")
		}
		return opcode;
	}

	operandsReadForOpcodeFromBitStream(opcode, bitStream)
	{
		var operandsSoFar = [];
		var returnOperands = this._operandsReadForOpcodeFromBitStream
		(
			opcode, operandsSoFar, bitStream
		);
		return returnOperands;
	}

	instructionOperandsWriteToBitStream(instruction, bitStream)
	{
		this._instructionOperandsWriteToBitStream(instruction, bitStream);
	}

}