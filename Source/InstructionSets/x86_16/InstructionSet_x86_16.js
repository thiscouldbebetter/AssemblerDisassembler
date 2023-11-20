
class InstructionSet_x86_16
{
	// Adapted from listings found at the following URLs:
	// https://en.wikipedia.org/wiki/X86_instruction_listings
	// http://ref.x86asm.net/coder32.html#xA5
	// http://www.felixcloutier.com/x86/
	// http://www.c-jump.com/CIS77/CPU/x86/lecture.html#X77_0120_encoding_add

	static build()
	{
		// Operand parsing.

		var opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor =
			InstructionSet_x86_16.opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor;
		var instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor =
			InstructionSet_x86_16.instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor;

		var opcodeValueFromOperands_Mov = InstructionSet_x86_16.opcodeValueFromOperands_Mov;
		var operandsRead_Mov = InstructionSet_x86_16.operandsReadFromBitStream_Mov;
		var operandsWrite_Mov = InstructionSet_x86_16.instructionOperandsWriteToBitStream_Mov;

		var operandsToOpcodeCallOrJump = (opcodeValueBase, opds) =>
		{
			var returnOpcode = null;

			var operandDestination = opds[0];
			var operandDestinationAsInt =
				parseInt(operandDestination.value);
			var hasDestinationBeenResolved =
				(operandDestinationAsInt != null);
			if (hasDestinationBeenResolved)
			{
				var destinationSizeInBits =
					operandDestination.operandType.size.sizeInBits;
				returnOpcode =
					opcodeValueBase
					+ (destinationSizeInBits != 8 ? 0 : 2);
			}
			else
			{
				returnOpcode = opcodeValueBase; // Assuming two-byte destination.
			}
			return returnOpcode;
		};

		var operandsToOpcodeCall = (opds) =>
		{
			return operandsToOpcodeCallOrJump(0x9A, opds);
		};

		var operandsToOpcodeJump = (opds) =>
		{
			return operandsToOpcodeCallOrJump(0xE9, opds);
		};

		var writeInstructionToBitStreamCallOrJump = (ins, bs) =>
		{
			var operandDestination = ins.operands[0];
			var destinationSizeInBits =
				operandDestination.operandType.size.sizeInBits;
			var operandDestinationAsInt =
				parseInt(operandDestination.value);
			var destinationValueToWrite =
				operandDestinationAsInt || 0;
			bs.writeIntegerUsingBitWidth
			(
				destinationValueToWrite,
				destinationSizeInBits
			);
		};


		var opcodeGroups =
		[
			/*
			//                         Operands
			//                         ------------------
			//     Mnemonic 	Code   Read         Write Description
			//     -------- 	----   ----         ----- ---------------------------

			// ASCII adjusts.
			new o("aaa", 		0x37, _0, 			null, "ascii adjust al after add"),
			new o("aad", 		0xD5, _8, 			null, "ascii adjust ax before div"), // opds: Radix.
			new o("aam", 		0xD4, _8, 			null, "ascii adjust ax after mult"), // opds: Radix.
			new o("aas", 		0x3F, _0,			null, "ascii adjust al after sub"), // opds: Radix.

			// Add with carry.
			*/

			new OpcodeAdc().opcodeGroupBuild(),

			// adds
			new OpcodeGroup
			(
				"add",
				(opds) => 0x0 + opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor(opds),
				() =>
				{
					throw new Error("todo - add");
				},
				(ins, bs) => instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor(ins, bs),
				[
					new Opcode(0x00, "add r/m8 r8"),
					new Opcode(0x01, "add r/m16 r16"),
					new Opcode(0x02, "add r8 r/m8"),
					new Opcode(0x03, "add r16 r/m16"),
					new Opcode(0x04, "add al imm8"),
					new Opcode(0x05, "add ax imm16")
				]
			),

			new OpcodeGroup
			(
				"and",
				(opds) => 0x20 + opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor(opds),
				() => { throw new Error("todo - and"); },
				(ins, bs) => instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor(ins, bs),
				[
					new Opcode(0x20, "and r/m8 r8"),
					new Opcode(0x21, "and r/m16 r16"),
					new Opcode(0x22, "and r8 r/m8"),
					new Opcode(0x23, "and r16 r/m16"),
					new Opcode(0x24, "and al imm8"),
					new Opcode(0x25, "and eax imm16")
				]
			),

			/*
			new o("arith0", 	0x80, null, 		null, "add,or,adc,sbb,and,sub,xor,cmp r/m8 imm8"),
			new o("arith1", 	0x81, null, 		null, "add,or,adc,sbb,and,sub,xor,cmp r/m16 imm16"),
			new o("arith2", 	0x82, null, 		null, "add,or,adc,sbb,and,sub,xor,cmp r/m8 imm8"),
			new o("arith3", 	0x83, null, 		null, "add,or,adc,sbb,and,sub,xor,cmp r/m16 imm8"),
			new o("arithf", 	0xD8, null, 		null, "add,mul,com,sub,subr,div,divr m32real"),

			new o("arpl", 		0x63, null, 		null, "adjust rpl field of segment selector"),

			// b
			new o("bound", 		0x52, null, 		null, "check index against bounds"),

			// c

			*/

			new OpcodeGroup
			(
				"call",
				operandsToOpcodeCall,
				() => { throw new Error("todo - call"); },
				writeInstructionToBitStreamCallOrJump,
				[
					new Opcode(0x9A, "call interrupt routine"),
				]
			),

			/*

			new o("cbw", 		0x98, null, 		null, "convert byte to word"),

			// clears
			new o("clc", 		0xF8, _0, 			null, "clear carry flag"),
			new o("cld", 		0xFC, _0, 			null, "clear direction flag"),
			new o("cli", 		0xFA, _0, 			null, "clear interrupt flag"),

			new o("cmc", 		0xF5, _0, 			null, "complement carry flag"),
			*/

			// compares
			new OpcodeGroup
			(
				"cmp",
				(opds) => 0x20 + opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor(opds),
				() => { throw new Error("todo - cmp"); },
				(ins, bs) => instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor(ins, bs),
				[
					new Opcode(0x38, "compare r/m8 r8"), // 0x05, 0x80/0..., 0x83/0
					new Opcode(0x39, "compare r/m16 r16"),
					new Opcode(0x3A, "compare r8 r/m8"),
					new Opcode(0x3B, "compare r16 r/m16"),
					new Opcode(0x3C, "compare al imm8"),
					new Opcode(0x3D, "compare eax imm16"),
				]
			),

			/*
			new o("cmpsb", 		0xA6, null, 		null, "compare bytes in memory"),
			new o("cmpsw", 		0xA7, null, 		null, "compare words"),

			new o("cwd", 		0x99, null, 		null, "convert word to doubleword"),

			// d

			// decimal adjusts
			new o("daa", 		0x27, null, 		null, "decimal adjust al after add"),
			new o("das", 		0x2F, null, 		null, "decimal adjust al after sub"),
			*/

			// decrements

			new OpcodeGroup
			(
				"dec",
				(opds) => { return 0x48 + (opds[0].value) },
				() => { throw new Error("todo - dec"); },
				(ins, bs) => {},
				[
					new Opcode(0x48, "decrement ax"),
					new Opcode(0x49, "decrement cx"),
					new Opcode(0x4A, "decrement dx"),
					new Opcode(0x4B, "decrement bx"),
					new Opcode(0x4C, "decrement ?"),
					new Opcode(0x4D, "decrement ?"),
					new Opcode(0x4E, "decrement si"),
					new Opcode(0x4F, "decrement di")
				]
			),

			/*
			new o("div", 		0xF6, null, 		null, "unsigned divide"), // 0xF6/6, 0xF7/6

			// e

			new o("enter", 		0xC8, null, 		null, "make stack frame for procedure parameters"),
			//new o("esc", ?, null, "used with floating-point unit");

			// h

			new o("hlt", 		0xF4, null, 		null, "enter halt state"),

			// i

			new o("idiv", 		0XF6, null, 		null, "signed divide"), // 0xF6/7, 0xF7/7
			new o("imul", 		0x69, null, 		null, "signed multiply"), // 0x6B, 0xF6/5, 0xF7/5, 0x0FAF

			// ins
			new o("insb", 		0x6C, null, 		null, "input from port to string m8 dx"),
			new o("insw/d", 	0x6D, null, 		null, "input from port to string m16 dx"),
			new o("inb", 		0xE4, null, 		null, "input reg from port al imm8"),
			new o("ins", 		0xE5, null, 		null, "input reg from port eax imm16"),
			*/

			// increments
			new OpcodeGroup
			(
				"inc",
				(opds) => { return 0x40 + (opds[0].value) },
				() => { throw new Error("todo - inc"); },
				(ins, bs) => {},
				[
					new Opcode(0x40, "increment ax"),
					new Opcode(0x41, "increment cx"),
					new Opcode(0x42, "increment dx"),
					new Opcode(0x43, "increment bx"),
					new Opcode(0x44, "increment sp"),
					new Opcode(0x45, "increment bp"),
					new Opcode(0x46, "increment di"),
					new Opcode(0x47, "increment si"),
				]
			),

			new OpcodeGroup
			(
				"int",
				(opds) => { return 0xCD; },
				() => { throw new Error("todo - int"); },
				(ins, bs) => {},
				[
					new Opcode(0xCD, "call interrupt routine"),
				]
			),

			/*
			new o("into", 		0xCE, null, 		null, "call to interrupt if overflow"),
			new o("iret", 		0xCF, null, 		null, "return from interrupt"),

			*/

			// j

			// jumps

			new OpcodeGroup
			(
				"jmp",
				operandsToOpcodeJump,
				() => { throw new Error("todo - jmp"); },
				writeInstructionToBitStreamCallOrJump,
				[
					new Opcode(0xE9, "jump rel16"),
					new Opcode(0xEA, "jump ptr16:16"),
					new Opcode(0xEB, "jump rel8")
				]
			),

			new OpcodeGroup
			(
				"jo",
				(opds) => { return 0x70; },
				() => { throw new Error("todo - jo"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x70, "jump if 0"),
				]
			),

			new OpcodeGroup
			(
				"jno",
				(opds) => { return 0x71; },
				() => { throw new Error("todo - jno"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x71, "jump if not 0"),
				]
			),

			new OpcodeGroup
			(
				"jb",
				(opds) => { return 0x72; },
				() => { throw new Error("todo - jb"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x72, "jb/nae/c"),
				]
			),

			new OpcodeGroup
			(
				"jnb",
				(opds) => { return 0x73; },
				() => { throw new Error("todo - jnb"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x73, "jnb/ae/nc"),
				]
			),

			new OpcodeGroup
			(
				"jz",
				(opds) => { return 0x74; },
				() => { throw new Error("todo - jz"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x74, "jz/e_b"),
				]
			),

			new OpcodeGroup
			(
				"jnz",
				(opds) => { return 0x75; },
				() => { throw new Error("todo - jnz"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x75, "jnz/e_b"),
				]
			),

			new OpcodeGroup
			(
				"jbe",
				(opds) => { return 0x76; },
				() => { throw new Error("todo - jbe"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x76, "jbe"),
				]
			),

			new OpcodeGroup
			(
				"jnbe",
				(opds) => { return 0x77; },
				() => { throw new Error("todo - jnbe"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x77, "jnbe/a"),
				]
			),

			new OpcodeGroup
			(
				"js",
				(opds) => { return 0x78; },
				() => { throw new Error("todo - js"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x78, "js"),
				]
			),

			new OpcodeGroup
			(
				"jns",
				(opds) => { return 0x79; },
				() => { throw new Error("todo - jns"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x79, "jns"),
				]
			),

			new OpcodeGroup
			(
				"jp",
				(opds) => { return 0x7A; },
				() => { throw new Error("todo - jp"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x7A, "jp/e"),
				]
			),

			new OpcodeGroup
			(
				"jnp",
				(opds) => { return 0x7B; },
				() => { throw new Error("todo - jnp"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x7B, "jnp/po"),
				]
			),

			new OpcodeGroup
			(
				"jlt",
				(opds) => { return 0x7C; },
				() => { throw new Error("todo - jlt"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x7C, "jump if less than"),
				]
			),

			new OpcodeGroup
			(
				"jge",
				(opds) => { return 0x7D; },
				() => { throw new Error("todo - jge"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x7D, "jump if greater than or equal"),
				]
			),

			new OpcodeGroup
			(
				"jle",
				(opds) => { return 0x7E; },
				() => { throw new Error("todo - jle"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x7E, "jump if less than or equal"),
				]
			),

			new OpcodeGroup
			(
				"jgt",
				(opds) => { return 0x7F; },
				() => { throw new Error("todo - jgt"); },
				(ins, bs) => { bs.writeIntegerUsingBitWidth(ins.opcode.value, 8); },
				[
					new Opcode(0x7F, "jump if greater than"),
				]
			),

			/*
			new o("jz/e_w", 	0x0F, _8_16, 		null, "jz/e_w"),

			// l

			new o("lahf", 		0x9F, null, 		null, "load flags into ah"),
			new o("lds", 		0xC5, null, 		null, "load pointer using ds"),
			new o("lea", 		0x8D, null, 		null, "load effective address"),
			new o("les", 		0xC4, null, 		null, "load es with pointer"),
			new o("lock", 		0xF0, null, 		null, "assert bus loc# signal"),
			*/

			new OpcodeGroup
			(
				"lodsb",
				(opds) => { return 0xAC; },
				() => { throw new Error("todo - lodsb"); },
				(ins, bs) => {},
				[
					new Opcode(0xAC, "load string byte"),
				]
			),

			new OpcodeGroup
			(
				"lodsw",
				(opds) => { return 0xAD; },
				() => { throw new Error("todo - lodsw"); },
				(ins, bs) => {},
				[
					new Opcode(0xAD, "load string byte"),
				]
			),
 
			/*

			// loops
			new o("loopnz", 	0xE0, null, 		null, "dec cx, jump if >0, zf 0"),
			new o("loopz", 		0xE1, null, 		null, "dec cx, jump if >0, zf 1"),
			new o("loopz", 		0xE2, null, 		null, "dec cx, jump if >0"),
			new o("jcxz", 		0xE3, null, 		null, "jump if cx 0"),

			*/

			// moves
			new OpcodeGroup
			(
				"mov",
				opcodeValueFromOperands_Mov,
				operandsRead_Mov,
				operandsWrite_Mov,
				[
					new Opcode(0x88, "move r/m8 r8"),
					new Opcode(0x89, "move r/m16 r16"),
					new Opcode(0x8A, "move r8 r/m8"),
					new Opcode(0x8B, "move r16 r/m16"),

					new Opcode(0xB0, "move al imm8"),
					new Opcode(0xB8, "move ax imm16"),

					// Not sure where these came from,
					// but they don't seem to match how FASM does it.
					// new Opcode(0xB8, "move al imm8"),
					// new Opcode(0xB9, "move ax imm16"),
				]
			),

			/*
			new o("", 	0x8C, movRead, movWrite, 	"move r/m16 Sreg"),
			new o("", 	0x8E, movRead, movWrite, 	"move Sreg r/m16"),
			new o("mov", sb" ], 		0xA4, movRead, movWrite, 	"move byte from string to string"),
			new o("mov", sw" ], 		0xA5, movRead, movWrite, 	"move word from string to string"),
			new o("mov", r1i8" ], 	0xB1, movRead, movWrite, 	"move r1 imm8"),
			new o("mov", r2i8" ], 	0xB2, movRead, movWrite, 	"move r2 imm8"),
			new o("mov", r3i8" ], 	0xB3, movRead, movWrite, 	"move r3 imm8"),
			new o("mov", r4i8" ], 	0xB4, movRead, movWrite, 	"move r4 imm8"),
			new o("mov", r5i8" ], 	0xB5, movRead, movWrite, 	"move r5 imm8"),
			new o("mov", r6i8" ], 	0xB6, movRead, movWrite, 	"move r6 imm8"),
			new o("mov", r7i8" ], 	0xB7, movRead, movWrite, 	"move r7 imm8"),
			new o("mov", 16r0" ], 	0xB8, movRead, movWrite, 	"move r0 (ax?) imm16"),
			
			new o("mov", r2iw" ], 	0xBA, movRead, movWrite, 	"move r2 imm16"),
			new o("mov", r3iw" ], 	0xBB, movRead, movWrite, 	"move r3 imm16"),
			new o("mov", r4iw" ], 	0xBC, movRead, movWrite, 	"move r4 imm16"),
			new o("mov", r5iw" ], 	0xBD, movRead, movWrite, 	"move r5 imm16"),
			new o("mov", r6iw" ], 	0xBE, movRead, movWrite, 	"move r6 imm16"),
			new o("mov", r7iw" ], 	0xBF, movRead, movWrite, 	"move r7 imm16"),

			//new o("mul", ?, null, "unsigned multiply"),
			//new o("neg", ?, null, "two's complement negation),
			new o("nop", 		0x90, null, 		null, "no operation"),

			//new o("not", ?, null, "logical not"),

			*/

			// ors
			new OpcodeGroup
			(
				"or",
				(opds) => 0x08 + opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor(opds),
				() => { throw new Error("todo - or"); },
				(ins, bs) => instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor(ins, bs),
				[
					new Opcode(0x08, "or r/m8 r8"),
					new Opcode(0x09, "or r/m16 r16"),
					new Opcode(0x0A, "or r8 r/m8"),
					new Opcode(0x0B, "or r16 r/m16"),
					new Opcode(0x0C, "or al imm8"),
					new Opcode(0x0D, "or eax imm16"),
				]
			),

			new OpcodeGroup
			(
				"org",
				(opds) => "org", // opcodeFromOperands
				() => { throw new Error("todo - org"); },
				(ins, bs) => {},
				[
					new Opcode("org", "set offset of program"),
				]
			),

			/*
			new o("out0", 		0xEE, null, 		null, "out dx al"),
			new o("out1", 		0xEF, null, 		null, "out dx eax"),
			new o("outsb", 		0x6E, null, 		null, "output dx m8"),
			new o("outsw/d", 	0x6F, null, 		null, "output dx m16"),
			new o("pushds", 	0x1F, null, 		null, "push ds onto stack"),
			new o("popes", 		0x07, null, 		null, "pop es from stack"),
			*/

			// pops

			new OpcodeGroup
			(
				"pop",
				(opds) => { return 0x58 + (opds[0].value) },
				() => { throw new Error("todo - pop"); },
				(ins, bs) => {},
				[
					new Opcode(0x58, "pop ax from stack"),
					new Opcode(0x59, "pop cx from stack"),
					new Opcode(0x5A, "pop dx from stack"),
					new Opcode(0x5B, "pop bx from stack"),
					new Opcode(0x5C, "pop sp from stack"),
					new Opcode(0x5D, "pop bp from stack"),
					new Opcode(0x5E, "pop si from stack"),
					new Opcode(0x5F, "pop di from stack")
				]
			),

			/*
			new o("popss", 		0x17, null, 		null, "pop ss from stack"),
			new o("popf", 		0x9D, null, 		null, "pop flags register from stack"),
			*/

			// pushes

			new OpcodeGroup
			(
				"push",
				(opds) =>
				{
					var returnOpcode = null;

					var operand0 = opds[0];
					var operand0Value = operand0.value;
					var operand0TypeRoleName = operand0.operandType.role.name;

					var isOperand0ALabel = (operand0TypeRoleName == "LabelName")
					if (isOperand0ALabel)
					{
						returnOpcode = 0x6A;
					}
					else
					{
						returnOpcode = 0x50 + operand0Value
					}
					return returnOpcode;
				},
				() => { throw new Error("todo"); },
				(ins, bs) =>
				{
					var opcodeValue = ins.opcode.value;
					if (opcodeValue == 0x6A)
					{
						bs.writeIntegerUsingBitWidth(opcodeValue, 8);
					}
				},
				[
					new Opcode(0x50, "push ax onto stack"),
					new Opcode(0x51, "push cx onto stack"),
					new Opcode(0x52, "push dx onto stack"),
					new Opcode(0x53, "push bx onto stack"),
					new Opcode(0x54, "push sp onto stack"),
					new Opcode(0x55, "push bp onto stack"),
					new Opcode(0x56, "push si onto stack"),
					new Opcode(0x57, "push di onto stack"),
					new Opcode(0x6A, "push label address onto stack")
				]
			),

			/*
			new o("pushcs", 	0x0E, null, 		null, "push cs onto stack"),
			new o("pushds", 	0x1E, null, 		null, "push ds onto stack"),
			new o("pushes", 	0x06, null, 		null, "push es onto stack"),
			new o("pushss", 	0x16, null, 		null, "push ss onto stack"),
			new o("pushf", 		0x9C, null, 		null, "push flags data onto stack"),

			new o("rep", 		0xF2, null, 		null, "repeat"), // rep, repe, repne, repnz, repz

			// returns

			new o("retf0", 		0xCA, null, 		null, "return from procedure"),
			new o("retf1", 		0xCB, null, 		null, "return from procedure"),
			new o("retn0", 		0xC2, null, 		null, "return from near procedure"),
			new o("retn1", 		0xC3, null, 		null, "return from near procedure"),
			*/

			new OpcodeGroup
			(
				"ret",
				(opds) => { return 0xC2; }, // todo
				() => { throw new Error("todo - ret"); },
				(ins, bs) => {},
				[
					new Opcode(0xC2, "return from near procedure"),
					new Opcode(0xC3, "return from near procedure"),
					new Opcode(0xCA, "return from procedure"),
					new Opcode(0xCB, "return from procedure"),

				]
			),

			/*

			// s

			new o("shrotbi", 	0xC0, null, 		null, "shift/rotate r/m8 imm8"),
			new o("shrotwi", 	0xC1, null, 		null, "shift/rotate r/m16 imm8"),
			new o("shrotb1", 	0xD0, null, 		null, "shift/rotate r/m8 1"),
			new o("shrotw1", 	0xD1, null, 		null, "shift/rotate r/m16 1"),
			new o("sahf", 		0x9E, null, 		null, "store ah into flags"),

			*/

			// subtracts with borrow
			new OpcodeGroup
			(
				"sbb",
				(opds) => 0x18 + opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor(opds),
				() => { throw new Error("todo - sbb"); },
				(ins, bs) => instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor(ins, bs),
				[
					new Opcode(0x18, "subtraction with borrow r/m8 r8"),
					new Opcode(0x19, "subtraction with borrow r/m16 r16"),
					new Opcode(0x1A, "subtraction with borrow r8 r/m8"),
					new Opcode(0x1B, "subtraction with borrow r16 r/m16"),
					new Opcode(0x1C, "subtraction with borrow al imm8"),
					new Opcode(0x1D, "subtraction with borrow ax imm16")
				]
			),

			/*
			new o("scasb", 		0xAE, null, 		null, "compare byte string"),
			new o("scasw", 		0xAF, null, 		null, "compare word string"),
			new o("seges", 		0x26, null, 		null, "es prefix"),
			new o("segcs", 		0x2E, null, 		null, "cs prefix"),
			new o("segds", 		0x3E, null, 		null, "ds prefix"),
			new o("stc", 		0xF9, null, 		null, "set carry flag"),
			new o("std", 		0xFD, null, 		null, "set direction flag"),
			new o("sti", 		0xFB, null, 		null, "set interrupt flag"),
			new o("stosb", 		0xAA, null, 		null, "store byte in string"),
			new o("stosw", 		0xAB, null, 		null, "store word in string"),
			*/

			// subtracts
			new OpcodeGroup
			(
				"sub",
				(opds) => 0x28 + opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor(opds),
				() => { throw new Error("todo - sub"); },
				(ins, bs) => instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor(ins, bs),
				[
					new Opcode(0x28, "subtract r/m8 r8"),
					new Opcode(0x29, "subtract r/m16 r16"),
					new Opcode(0x2A, "subtract r8 r/m8"),
					new Opcode(0x2B, "subtract r16 r/m16"),
					new Opcode(0x2C, "subtract al imm8"),
					new Opcode(0x2D, "subtract ax imm16"),
				]
			),

			new OpcodeGroup
			(
				"times",
				(opds) => "times",
				() => { throw new Error("todo - times"); },
				(ins, bs) => {},
				[
					new Opcode("times", "repeat next instruction")
				]
			),

			new OpcodeGroup
			(
				"use16",
				(opds) => "use16",
				() => { throw new Error("todo - use16"); },
				(ins, bs) => {},
				[
					new Opcode("use16", "use 16-bit instructions")
				]
			),

			/*
			new o("wait", 		0x9B, null, 		null, "wait until not busy"),

			// exchanges
			new o("xchgr0", 	0x90, null, 		null, "exchange r0 16 eAX"),
			new o("xchgr1", 	0x90, null, 		null, "exchange r1 16 eAX"),
			new o("xchgr2", 	0x90, null, 		null, "exchange r2 16 eAX"),
			new o("xchgr3", 	0x90, null, 		null, "exchange r3 16 eAX"),
			new o("xchgr4", 	0x90, null, 		null, "exchange r4 16 eAX"),
			new o("xchgr5", 	0x90, null, 		null, "exchange r5 16 eAX"),
			new o("xchgr6", 	0x90, null, 		null, "exchange r6 16 eAX"),
			new o("xchgr7", 	0x90, null, 		null, "exchange r7 16 eAX"),
			new o("xchgrrb", 	0x86, null, 		null, "exchange registers 8"),
			new o("xchgrrw", 	0x86, null, 		null, "exchange registers 16"),

			new o("xlat", 		0xD7, null, 		null, "table look-up translation"),
			*/

			new OpcodeGroup
			(
				"xor",
				(opds) => 0x30 + opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor(opds),
				() => { throw new Error("todo - xor"); },
				(ins, bs) => instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor(ins, bs),
				[
					new Opcode(0x30, "xor r/m8 r8"),
					new Opcode(0x31, "xor r/m16 r16"),
					new Opcode(0x32, "xor r8 r/m8"),
					new Opcode(0x33, "xor r16 r/m16"),
					new Opcode(0x34, "xor al imm8"),
					new Opcode(0x35, "xor ax imm16")
				]
			)
		];

		var instructionSet = new InstructionSet
		(
			"x86",
			8, // opcodeWidthInBits
			opcodeGroups,
			InstructionSet_x86_16.instructionFromAssemblyCode,
			InstructionSet_x86_16.instructionReadFromBitStream
		);

		return instructionSet;
	}

	static instructionFromAssemblyCode
	(
		instructionSet, assemblyCode
	)
	{
		var commentDelimiter = ";"
		assemblyCode = assemblyCode.split(commentDelimiter)[0];
		if (assemblyCode.trim() == "")
		{
			return null;
		}

		var mnemonicAndOperands =
			assemblyCode.split(",").join(" ").split(" ").filter(x => x != ""); 

		var mnemonic = mnemonicAndOperands[0];

		var opcode = null;
		var operands = null;

		if (mnemonic == "db" || mnemonic == "dw")
		{
			opcode = new Opcode("data"); // hack
			var dataToWriteAsString = "";

			var operandsAsString = assemblyCode.substr(mnemonic.length + 1);
			var operandsAsStrings = operandsAsString.split(","); // todo - Commas in quotes.

			for (var i = 0; i < operandsAsStrings.length; i++)
			{
				var operand = operandsAsStrings[i];
				var operandIsQuotedString = operand.startsWith("'");
				if (operandIsQuotedString)
				{
					operand = operand.split("'").join("");
					dataToWriteAsString += operand;
				}
				else
				{
					var operandAsInteger = parseInt(operand);
					var operandAsCharacter = String.fromCharCode(operandAsInteger);
					dataToWriteAsString += operandAsCharacter;
				}
			}
			var operandRole = OperandRole.Instances().Data;
			var operandSize = OperandSize.fromNameAndSizeInBits
			(
				"data", dataToWriteAsString.length
			);
			var operandType =
				OperandType.fromRoleAndSize(operandRole, operandSize);
			var operand = Operand.fromTypeAndValue(operandType, dataToWriteAsString);
			operands = [ operand ];
		}
		else if (mnemonic.endsWith(":"))
		{
			opcode = new Opcode("label"); // hack

			var labelName = mnemonic.substr(0, mnemonic.length - 1);

			var operandRole = OperandRole.Instances().LabelName;
			var operandSizeInBytesAssumed = 2;
			var operandSize = OperandSize.fromNameAndSizeInBits
			(
				"label", operandSizeInBytesAssumed
			);
			var operandType =
				OperandType.fromRoleAndSize(operandRole, operandSize);
			var operand = Operand.fromTypeAndValue(operandType, labelName);
			operands = [ operand ];
		}
		else
		{
			var operandsAsStrings = mnemonicAndOperands.slice(1);
			operandsAsStrings = operandsAsStrings.filter(x => x != null);

			operands = operandsAsStrings.map
			(
				x => InstructionSet_x86_16.operandFromString(x)
			);

			var opcodeGroup =
				instructionSet.opcodeGroupByMnemonic(mnemonic);

			if (opcodeGroup == null)
			{
				throw new Error("Unrecognized mnemonic: " + mnemonic);
			}

			var opcode = opcodeGroup.opcodeFromOperands(operands);
		}

		var instruction = new Instruction(opcode, operands);

		return instruction;
	}

	static opcodeOffsetFromOperands_Add_And_Or_Sbb_Sub_Xor(operands)
	{
		var opcodeOffset = null;

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
			opcodeOffset = (operand1SizeInBits == 8 ? 4 : 5);
		}
		else if (operand1RoleName == operandRolesAll.RegisterContents.name)
		{
			if (operand0RoleName == operandRolesAll.RegisterContents.name)
			{
				opcodeOffset = (operand1SizeInBits == 8 ? 0 : 1);
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

		return opcodeOffset;
	}

	static opcodeValueFromOperands_Mov(operands)
	{
		var opcodeOffset = null;

		var operand0 = operands[0];
		var operand0Type = operand0.operandType;
		var operand0RoleName = operand0Type.role.name;
		var operand0SizeInBits = operand0Type.size.sizeInBits;

		if (operands.length == 2)
		{
			var operand1 = operands[1];
			var operand1Type = operand1.operandType;
			var operand1RoleName = operand1Type.role.name;
			var operand1SizeInBits = operand1Type.size.sizeInBits;
		}

		var operandRolesAll = OperandRole.Instances();

		if (operand0RoleName == operandRolesAll.Immediate.name)
		{
			// The other operand is implicitly encoded in the opcode value.
			opcodeOffset = 0x2F; // todo
		}
		else if (operand0RoleName == operandRolesAll.RegisterContents.name)
		{
			if (operand1RoleName == operandRolesAll.Immediate.name)
			{
				opcodeOffset = 0x2F; // todo
				operand1.operandType.size.sizeInBits =
					operand0.value.widthInBits; // Assumes opd0 is a "RegisterContents".
			}
			else if (operand1RoleName == operandRolesAll.RegisterContents.name)
			{
				opcodeOffset = 0;
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
			{
				opcodeOffset = 2;
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
			{
				opcodeOffset = 2;
			}
		}
		else if (operand0RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
		{
			if (operand1RoleName == operandRolesAll.Immediate.Name)
			{
				throw new Error("Not yet implemented!");
			}
			else if (operand1RoleName == operandRolesAll.RegisterContents.name)
			{
				opcodeOffset = 0;
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
			{
				throw new Error("Not yet implemented!");
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
			{
				throw new Error("Not yet implemented!");
			}
		}
		else if (operand0RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
		{
			if (operand1RoleName == operandRolesAll.Immediate.Name)
			{
				throw new Error("Not yet implemented!");
			}
			else if (operand1RoleName == operandRolesAll.RegisterContents.name)
			{
				opcodeOffset = 0;
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
			{
				throw new Error("Not yet implemented!");
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
			{
				throw new Error("Not yet implemented!");
			}
		}

		var opcodeOffsetForSize = (operand0SizeInBits == 8 ? 0 : 1);
		opcodeOffset += opcodeOffsetForSize;

		var opcodeBase = 0x88;
		var opcodeValue = opcodeBase + opcodeOffset;

		return opcodeValue;
	}

	static instructionReadFromBitStream(instructionSet, bitStream)
	{
		var opcodeValue = bitStream.readByte();

		var opcode = instructionSet.opcodeByValue(opcodeValue);
		var operands = null;

		if (opcode == null)
		{
			var opcodeValueAsHex = opcodeValue.toString("16");
			opcode = new InstructionOpcode
			(
				"_" + opcodeValueAsHex, opcodeValue, "[unrecognized]"
			);
		}
		else
		{
			operands =
				opcode.operandsReadFromBitStream(bitStream);
		}

		var instruction = new Instruction(opcode, operands);

		return instruction;
	}

	static operandFromString(operandAsString)
	{
		var operandRoles = OperandRole.Instances();
		var operandSizes = OperandSize.Instances();

		operandAsString = operandAsString.split(" ").join("");

		var operandRole = null;
		var operandSize = operandSizes.ThreeBits;
		var operandValue = null;

		var operandAsInteger = parseInt(operandAsString);

		if (isNaN(operandAsInteger) == false)
		{
			operandRole = operandRoles.Immediate;
			if (operandAsInteger <= 255)
			{
				operandSize = operandSizes.Byte;
			}
			else
			{
				operandSize = operandSizes.Word;
			}
			operandValue = operandAsInteger;
		}
		else if (operandAsString.startsWith("["))
		{
			var registerName = operandAsString.substr(1, 2);
			if (registerName == "bx")
			{
				operandValue = 7;
			}
			else
			{
				throw new Error("todo");
			}

			var indexOfPlusSign = operandAsString.indexOf("+");
			if (indexOfPlusSign >= 0)
			{
				operandRole = operandRoles.MemoryAtAddressInRegisterPlusOffset;
				var offsetAsString =
					operandAsString.substr(indexOfPlusSign + 1).split("]").join("");
				var offset = parseInt(offsetAsString);
				var offsetSizeInBits = 8;
				operandSize = operandSizes.ElevenBits;
				operandValue = (operandValue << offsetSizeInBits) + offset;
			}
			else
			{
				operandRole = operandRoles.MemoryAtAddressInRegister;
			}
		}
		else if (Register.byName(operandAsString) != null)
		{
			operandRole = operandRoles.RegisterContents;

			var registerName = operandAsString;
			operandValue = Register.byName(registerName);
		}
		else
		{
			operandRole = operandRoles.LabelName;
			operandSize = OperandSize.fromNameAndSizeInBits
			(
				"LabelName", 2 * 8 // Assume two bytes for now.
			);
			operandValue = operandAsString;
		}

		if (operandValue == null)
		{
			throw new Error("Unrecognized operand: " + operandAsString);
		}

		var operandType =
			OperandType.fromRoleAndSize(operandRole, operandSize);
		var returnOperand =
			Operand.fromTypeAndValue(operandType, operandValue);

		return returnOperand;
	}

	// operandsReadFromBitStream.

	static operandsReadFromBitStream_Mov(opcode, operands, bitStream)
	{
		var doBothOperandsReferenceRegisters = (opcode.value < 0xB0);

		var operandsGet =
		(
			doBothOperandsReferenceRegisters
			? InstructionSet_x86_16.operandsReadFromBitStream_Mov_Registers
			: InstructionSet_x86_16.operandsReadFromBitStream_Mov_Immediate
		);

		var operands = operandsGet(opcode, operands, bitStream);

		return operands;
	}

	static operandsReadFromBitStream_Mov_Immediate
	(
		opcode, operands, bitStream
	)
	{
		var lastBitOfOpcode = opcode.value & 1;
		var operand1WidthInBytes = (lastBitOfOpcode == 0 ? 2 : 1);

		var lastThreeBitsOfOpcode = opcode.value & 7;
		var registerToSetCode = lastThreeBitsOfOpcode;
		var operand0Value = registerToSetCode; // todo

		var operand1AsBytes =
			bitStream.readBytes(operand1WidthInBytes);
		var operand1AsByteStream =
			new ByteStreamLittleEndian(operand1AsBytes);
		var operand1Value =
			operand1AsByteStream.readIntegerWithWidthInBytes(2);

		var operandRoles = OperandRole.Instances();
		var operand0Role = operandRoles.RegisterContents;
		var operand1Role = operandRoles.Immediate;

		var operand0Type =
			OperandType.fromRoleAndSize(operand0Role, 3);
		var operand1Type =
			OperandType.fromRoleAndSize(operand1Role, operand1WidthInBytes * 8);

		var operand0 =
			Operand.fromTypeAndValue(operand0Type, operand0Value);
		var operand1 =
			Operand.fromTypeAndValue(operand1Type, operand1Value);

		operands.push(operand0);
		operands.push(operand1);

		return operands;
	}

	static operandsReadFromBitStream_Mov_Registers(opcode, operands, bitStream)
	{
		var operand0Type = bitStream.readBit();
		var operand1Type = bitStream.readBit();

		var operand0Value = bitStream.readBitsAsInteger(3);
		var operand1Value = bitStream.readBitsAsInteger(3);

		var registerWidth = 16; // hack - Assuming 16-bit registers.

		var operand0Register =
			Register.byCodeAndWidthInBits(operand0Value, registerWidth);
		var operand1Register =
			Register.byCodeAndWidthInBits(operand1Value, registerWidth);

		var operand0Type =
			OperandType.fromOperandAsString(operand0Register.name);
		var operand1Type =
			OperandType.fromOperandAsString(operand1Register.name);

		var operand0 =
			Operand.fromTypeAndValue(operand0Type, operand0Register);
		var operand1 =
			Operand.fromTypeAndValue(operand1Type, operand1Register);

		operands.push(operand0);
		operands.push(operand1);

		var reverseOperandsFlag = (opcode.value >> 1) & 1;
		var areOperandsReversed = (reverseOperandsFlag == 0);
		if (areOperandsReversed)
		{
			operands = operands.slice().reverse();
		}

		return operands;
	}

	static instructionOperandsWriteToBitStream_Add_Or_Sbb_Sub_Xor
	(
		instruction, bitStream
	)
	{
		var operands = instruction.operands;

		var operand0 = operands[0];
		var operand1 = operands[1];

		var operandRoles = operands.map(x => x.operandType.role);
		var operand0Role = operandRoles[0];
		var operand1Role = operandRoles[1];

		var operandRolesAll = OperandRole.Instances();

		var operandRolesCodeToWrite = null;

		if (operand0Role == operandRolesAll.RegisterContents)
		{
			if (operand1Role == operandRolesAll.Immediate)
			{
				operandRolesCodeToWrite = null;
			}
			else if (operand1Role == operandRolesAll.RegisterContents)
			{
				operandRolesCodeToWrite = 3;
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegister)
			{
				operandRolesCodeToWrite = 0;
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				operandRolesCodeToWrite = 1;
			}
		}
		else if (operand0Role == operandRolesAll.MemoryAtAddressInRegister)
		{
			if (operand1Role == operandRolesAll.RegisterContents)
			{
				operandRolesCodeToWrite = 0;
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegister)
			{
				throw new Error("todo");
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				throw new Error("todo");
			}
		}
		else if (operand0Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
		{
			if (operand1Role == operandRolesAll.RegisterContents)
			{
				operandRolesCodeToWrite = 1;
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegister)
			{
				throw new Error("todo");
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				throw new Error("todo");
			}
		}

		if (operandRolesCodeToWrite == null)
		{
			operands = [ operand1 ];
		}
		else
		{
			bitStream.writeIntegerUsingBitWidth(operandRolesCodeToWrite, 2);

			// Depending on opcode, operands may be written
			// in the reverse of the order
			// that they appear in the assembly code.

			var opcode = instruction.opcode;
			var reverseOperandsFlag = (opcode.value >> 1) & 1;
			var areOperandsReversed = (reverseOperandsFlag == 0);
			if (areOperandsReversed)
			{
				operands = operands.slice().reverse();
			}

		}

		for (var i = 0; i < operands.length; i++)
		{
			var operand = operands[i];
			operand.writeToBitStream(bitStream);
		}
	}


	static instructionOperandsWriteToBitStream_Mov(instruction, bitStream)
	{
		var opcode = instruction.opcode;
		var doBothOperandsReferenceRegisters = (opcode.value < 0xB0);

		var operandsWrite =
		(
			doBothOperandsReferenceRegisters
			? InstructionSet_x86_16.instructionOperandsWriteToBitStream_Mov_Registers
			: InstructionSet_x86_16.instructionOperandsWriteToBitStream_Mov_Immediate
		);

		operandsWrite(instruction, bitStream);
	}

	static instructionOperandsWriteToBitStream_Mov_Registers(instruction, bitStream)
	{
		var operands = instruction.operands;

		var operandRolesCodeToWrite =
			InstructionSet_x86_16.operandRolesCodeGetForOperands(operands);

		if (operandRolesCodeToWrite == null)
		{
			// Do nothing.
		}
		else
		{
			bitStream.writeIntegerUsingBitWidth(operandRolesCodeToWrite, 2);
		}

		// Depending on opcode, operands may be written
		// in the reverse of the order
		// that they appear in the assembly code.

		var opcode = instruction.opcode;
		var reverseOperandsFlag = (opcode.value >> 1) & 1;
		var areOperandsReversed = (reverseOperandsFlag == 0);
		if (areOperandsReversed)
		{
			operands = operands.slice().reverse();
		}

		for (var i = 0; i < operands.length; i++)
		{
			var operand = operands[i];
			operand.writeToBitStream(bitStream);
		}
	}

	static operandRolesCodeGetForOperands(operands)
	{
		var operandRoles = operands.map(x => x.operandType.role);
		var operand0Role = operandRoles[0];
		var operand1Role = operandRoles[1];

		var operandRolesAll = OperandRole.Instances();

		var operandRolesCodeToWrite = null;

		if (operand0Role == operandRolesAll.RegisterContents)
		{
			if (operand1Role == operandRolesAll.Immediate)
			{
				operandRolesCodeToWrite = null;
			}
			else if (operand1Role == operandRolesAll.RegisterContents)
			{
				operandRolesCodeToWrite = 3;
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegister)
			{
				operandRolesCodeToWrite = 0;
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				operandRolesCodeToWrite = 1;
			}
		}
		else if (operand0Role == operandRolesAll.MemoryAtAddressInRegister)
		{
			if (operand1Role == operandRolesAll.RegisterContents)
			{
				operandRolesCodeToWrite = 0;
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegister)
			{
				throw new Error("todo");
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				throw new Error("todo");
			}
		}
		else if (operand0Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
		{
			if (operand1Role == operandRolesAll.RegisterContents)
			{
				operandRolesCodeToWrite = 1;
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegister)
			{
				throw new Error("todo");
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				throw new Error("todo");
			}
		}

		return operandRolesCodeToWrite;
	}

	static instructionOperandsWriteToBitStream_Mov_Immediate
	(
		instruction, bitStream
	)
	{
		// throw new Error("todo - Copied from _Registers() and not yet fixed.");

		var operands = instruction.operands;
		if (operands.length == 2)
		{
			// hack
			// Remove the first operand,
			// as it is implicitly encoded in the opcode value.
			operands.splice(0, 1);
		}

		var operand0 = operands[0];

		var widthInBits = operand0.operandType.size.sizeInBits;
		var widthInBytes = widthInBits / 8;
		var operand0AsByteStream = new ByteStreamLittleEndian([]);
		operand0AsByteStream.writeIntegerWithWidthInBytes
		(
			operand0.value, widthInBytes
		);
		var operand0AsBytes = operand0AsByteStream.bytes;

		bitStream.writeBytes(operand0AsBytes);
	}
}
