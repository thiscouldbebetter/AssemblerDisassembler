
class Program
{
	constructor(name, instructionSetName, bytes)
	{
		this.name = name;
		this.instructionSetName = instructionSetName;
		this.bytes = bytes;
	}

	instructionSet()
	{
		return InstructionSet.byName(this.instructionSetName);
	}

	toStringAssembly()
	{
		var instructionSet = this.instructionSet();

		var bitStream = new BitStream(this.bytes);

		var instructions = [];

		var bitStream = new BitStream(this.bytes);

		while (bitStream.hasMoreBits())
		{
			var opcodeValue = bitStream.readByte();

			var opcode = instructionSet.opcodeByValue(opcodeValue);

			if (opcode == null)
			{
				var opcodeValueAsHex = opcodeValue.toString("16");
				opcode = new InstructionOpcode
				(
					"_" + opcodeValueAsHex, opcodeValue, "[unrecognized]"
				);
				//throw "Unrecognized opcode: " + opcodeValue;
			}
			else
			{
				var operands =
					opcode.operandsReadFromBitStream(bitStream);

				var instruction = new Instruction(opcode, operands);
				instructions.push(instruction);
			}
		}

		var returnValue = instructions.join("\n");

		return returnValue;
	}
}
