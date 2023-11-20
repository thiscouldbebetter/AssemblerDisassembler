
class OpcodeAdc
{
	opcodeGroupBuild()
	{
		var returnValue = new OpcodeGroup
		(
			"adc",
			this.opcodeFromOperands_Adc.bind(this),
			this.operandsReadFromBitStream_Adc.bind(this),
			this.instructionOperandsWriteToBitStream_Adc.bind(this),
			[
				new Opcode(0x10, "add with carry r/m8 r8"),
				new Opcode(0x11, "add with carry r/m16 r16"),
				new Opcode(0x12, "add with carry r8 r/m8"),
				new Opcode(0x13, "add with carry r16 r/m16"),
				new Opcode(0x14, "add with carry al imm8"),
				new Opcode(0x15, "add with carry ax imm16"),

				new Opcode(0x81, "add with carry r? imm16"),
				new Opcode(0x83, "add with carry al imm8")
			]
		);

		return returnValue;
	}

	opcodeFromOperands_Adc(operands)
	{
		var opcode = null;

		var operand0 = operands[0];
		var operand1 = operands[1];

		var operand0Type = operand0.operandType;
		var operand0RoleName = operand0Type.role.name;
		var operand0SizeInBits = operand0Type.size.sizeInBits;

		var operand1Type = operand1.operandType;
		var operand1RoleName = operand1Type.role.name;
		var operand1SizeInBits = operand1Type.size.sizeInBits;

		var operandRolesAll = OperandRole.Instances();

		if (operand1RoleName == operandRolesAll.Immediate.name)
		{
			if (operand1SizeInBits == 8)
			{
				opcode = 0x83;
			}
			else
			{
				var registerCode = operand0.value.code;
				if (registerCode == 0)
				{
					opcode = 0x15;
				}	
				else
				{
					opcode = 0x81;
				}
			}
		}
		else if (operand1RoleName == operandRolesAll.RegisterContents.name)
		{
			if (operand0RoleName == operandRolesAll.RegisterContents.name)
			{
				opcode = (operand1SizeInBits == 8 ? "todo" : "todo");
			}
			else
			{
				throw new Error("Unexpected operand role!");
			}
		}
		else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
		{
			throw new Error("Unexpected operand role!");
		}
		else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
		{
			throw new Error("Unexpected operand role!");
		}

		return opcode;
	}

	operandsReadFromBitStream_Adc(opcode, operands, bitStream)
	{	
		var opcodeValue = opcode.value;

		var operandsGet;

		var operandsAreRegisterAndImmediate =
			opcodeValue == 0x15
			|| opcodeValue == 0x81
			|| opcodeValue == 0x83;

		if (operandsAreRegisterAndImmediate)
		{
			operandsGet =
				this.operandsReadFromBitStream_Adc_RegisterAndImmediate;
		}
		else
		{
			throw new Error("todo - Opcode not yet implemented for ADC: " + opcodeValue);
		}

		var operands = operandsGet(opcode, operands, bitStream);

		return operands;
	}

	operandsReadFromBitStream_Adc_RegisterAndImmediate
	(
		opcode, operands, bitStream
	)
	{
		var opcodeValue = opcode.value;

		var operandRoles = OperandRole.Instances();

		var nibble0xD = bitStream.readNibble();
		if (nibble0xD != 0xD)
		{
			throw "Unexpected value: " + nibble0xD;
		}

		var operand0Size = OperandSize.Instances().Byte;
		var operand0Type = new OperandType
		(
			operandRoles.RegisterContents, operand0Size
		);

		var registerCode = bitStream.readNibble();
		var operand0 = new Operand(operand0Type, registerCode);

		var operand1Size = OperandSize.Instances().Byte;
		var operand1Type = new OperandType
		(
			operandRoles.Immediate, operand1Size
		);
		var operand1Value = bitStream.readByte();
		var operand1 = new Operand(operand1Type, operand1Value);

		operands.push(operand0);
		operands.push(operand1);

		return operands;
	}

	instructionOperandsWriteToBitStream_Adc
	(
		instruction, bitStream
	)
	{
		var opcode = instruction.opcode;
		var opcodeValue = opcode.value;

		var operands = instruction.operands;
		var operand0 = operands[0];
		var operand1 = operands[1];

		bitStream.writeNibble(0xd);
		var registerCode = operand0.value.code;

		if 
		(
			opcodeValue == 0x15
			|| opcodeValue == 0x81
			|| opcodeValue == 0x83
		)
		{
			bitStream.writeNibble(registerCode);
			bitStream.writeByte(operand1.value);
		}
		else
		{
			throw new Error("todo - Opcode not yet implemented for adc: " + opcodeValue);
		}
	}
}