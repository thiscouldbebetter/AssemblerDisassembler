
class Program
{
	constructor(name, bytes)
	{
		this.name = name;
		this.bytes = bytes;
	}

	toStringAssembly()
	{
		var opcodesByValue = 
			InstructionOpcode.Instances()._OpcodesByValue;

		var bitStream = new BitStream(this.bytes);

		var instructions = [];

		var bitStream = new BitStream(this.bytes);

		while (bitStream.hasMoreBits())
		{
			var opcodeValue = bitStream.readByte();

			var opcode = opcodesByValue.get(opcodeValue);

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
				var operands = [];
				var operandWidths = opcode.operandWidthsInBits;
				var operandBitsSoFar = 0;
				for (var j = 0; j < operandWidths.length; j++)
				{
					var operandWidth = operandWidths[j];
					var operand = null;

					if (operandWidth <= 8)
					{
						operand = bitStream.readBitsAsInteger(operandWidth);
					}
					else if (operandWidth == 16)
					{
						operand = bitStream.readBytesAsIntegerLittleEndian(2);
					}
					else
					{
						// todo
						throw("Unexpected operand width:" + operandWidth);
					}

					operands.push(operand);
					operandBitsSoFar += operandWidth;
				}

				var instruction = new Instruction(opcode, operands);
				instructions.push(instruction);
			}
		}

		var returnValue = instructions.join("\n");

		return returnValue;
	}
}
