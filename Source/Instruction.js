
class Instruction //
{
	constructor(opcode, operands)
	{
		this.opcode = opcode;
		this.operands = operands;
	}

	toString()
	{
		var opcodeAsString =
			(this.opcode == null ? "???" : this.opcode.toString());

		var operandsAsString =
			this.operands.map(x => x.toString()).join(", ");

		var returnValue =
			opcodeAsString + " " + operandsAsString; 

		return returnValue;
	}
}
