
class Instruction
{
	constructor(opcode, operands)
	{
		this.opcode = opcode;
		this.operands = operands;
	}

	toString()
	{
		var opcodeAsString =
			(this.opcode == null ? "???" : this.opcode.mnemonic);
		var returnValue = opcodeAsString;
		for (var i = 0; i < this.operands.length; i++)
		{ 
			var operand = this.operands[i];
			returnValue += " " + operand.toString();
		}
		return returnValue;
	}
}
