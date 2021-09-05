
class InstructionSet_x86_16
{
	// Adapted from listings found at the following URLs:
	// https://en.wikipedia.org/wiki/X86_instruction_listings
	// http://ref.x86asm.net/coder32.html#xA5
	// http://www.felixcloutier.com/x86/
	// http://www.c-jump.com/CIS77/CPU/x86/lecture.html#X77_0120_encoding_add

	static build()
	{
		var o = Opcode;

		// Simple operand parsing.

		// Common operand bit width arrays.
		var _0 = (s) => []
		var _4_4 = (s) => [ s.readBitsAsInteger(4), s.readBitsAsInteger(4) ];
		var _8 = (s) => [ s.readBitsAsInteger(8) ];
		var _8_8 = (s) => [ s.readBitsAsInteger(8), s.readBitsAsInteger(8) ];
		var _8_16 =
			(s) =>
				[
					s.readBytesAsIntegerLittleEndian(1),
					s.readBytesAsIntegerLittleEndian(2)
				];
		var _16 = (s) => [ s.readBitsAsInteger(16) ];
		var _16_16 = (s) => [ s.readBitsAsInteger(16), s.readBitsAsInteger(16) ];

		// More complex operand parsing.

		var opcodeValueFromOperands_Adc = InstructionSet_x86_16.opcodeValueFromOperands_Adc;
		var operandsRead_Adc = InstructionSet_x86_16.opcodeValueFromOperands_Mov; // todo
		var operandsWrite_Adc = InstructionSet_x86_16.instructionOperandsWriteToBitStream_Adc;

		var opcodeValueFromOperands_Mov = InstructionSet_x86_16.opcodeValueFromOperands_Mov;
		var operandsRead_Mov = InstructionSet_x86_16.operandsReadFromBitStream_Mov;
		var operandsWrite_Mov = InstructionSet_x86_16.instructionOperandsWriteToBitStream_Mov;

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

			new OpcodeGroup
			(
				"adc",
				opcodeValueFromOperands_Adc,
				operandsRead_Adc,
				operandsWrite_Adc,
				[
					new Opcode(0x10, "add with carry r/m8 r8"),
					new Opcode(0x11, "add with carry r/m16 r16"),
					new Opcode(0x12, "add with carry r8 r/m8"),
					new Opcode(0x13, "add with carry r16 r/m16"),
					new Opcode(0x14, "add with carry al imm8"),
					new Opcode(0x15, "add with carry ax imm16"),
				]
			),

			/*
			// adds
			new o("add_rmrb", 	0x00, null, 	null, "add r/m8 r8"),
			new o("add_rrw", 	0x01, null, 	null, "add r/m16 r16"),
			new o("add_rrmb", 	0x02, null, 	null, "add r8 r/m8"),
			new o("add_rrmw", 	0x03, null, 	null, "add r16 r/m16"),
			new o("add_aib", 	0x04, _8, 		null, "add al imm8"),
			new o("add_aiw", 	0x05, _16, 		null, "add eax imm16"),

			new o("and_rmrb", 	0x20, null, 	null, "and r/m8 r8"),
			new o("and_rmrw", 	0x21, null, 	null, "and r/m16 r16"),
			new o("and_rrmb", 	0x22, null, 	null, "and r8 r/m8"),
			new o("and_rrmw", 	0x23, null, 	null, "and r16 r/m16"),
			new o("and_aib", 	0x24, _8, 		null, "and al imm8"),
			new o("and_aiw", 	0x25, _16, 		null, "and eax imm16"),

			new o("arith0", 	0x80, null, 		null, "add,or,adc,sbb,and,sub,xor,cmp r/m8 imm8"),
			new o("arith1", 	0x81, null, 		null, "add,or,adc,sbb,and,sub,xor,cmp r/m16 imm16"),
			new o("arith2", 	0x82, null, 		null, "add,or,adc,sbb,and,sub,xor,cmp r/m8 imm8"),
			new o("arith3", 	0x83, null, 		null, "add,or,adc,sbb,and,sub,xor,cmp r/m16 imm8"),
			new o("arithf", 	0xD8, null, 		null, "add,mul,com,sub,subr,div,divr m32real"),

			new o("arpl", 		0x63, null, 		null, "adjust rpl field of segment selector"),

			// b
			new o("bound", 		0x52, null, 		null, "check index against bounds"),

			// c

			new o("call", 		0x9A, null, 		null, "call procedure"), // 0xE8, 0xFF/2, 0xFF/3
			new o("cbw", 		0x98, null, 		null, "convert byte to word"),

			// clears
			new o("clc", 		0xF8, _0, 			null, "clear carry flag"),
			new o("cld", 		0xFC, _0, 			null, "clear direction flag"),
			new o("cli", 		0xFA, _0, 			null, "clear interrupt flag"),

			new o("cmc", 		0xF5, _0, 			null, "complement carry flag"),

			// compares
			new o("cmp0", 		0x38, null, 		null, "compare r/m8 r8"), // 0x05, 0x80/0..., 0x83/0
			new o("cmp1", 		0x39, null, 		null, "compare r/m16 r16"),
			new o("cmp2", 		0x3A, null, 		null, "compare r8 r/m8"),
			new o("cmp3", 		0x3B, null, 		null, "compare r16 r/m16"),
			new o("cmp4", 		0x3C, null, 		null, "compare al imm8"),
			new o("cmp5", 		0x3D, null, 		null, "add eax imm16"),
			new o("cmpsb", 		0xA6, null, 		null, "compare bytes in memory"),
			new o("cmpsw", 		0xA7, null, 		null, "compare words"),

			new o("cwd", 		0x99, null, 		null, "convert word to doubleword"),

			// d

			// decimal adjusts
			new o("daa", 		0x27, null, 		null, "decimal adjust al after add"),
			new o("das", 		0x2F, null, 		null, "decimal adjust al after sub"),

			// decrements
			new o("decr0", 		0x48, _0, 			null, "decrement register 0 (ax?)"),
			new o("decr1", 		0x49, _0, 			null, "decrement register 1"),
			new o("decr2", 		0x4A, _0, 			null, "decrement register 2"),
			new o("decr3", 		0x4B, _0, 			null, "decrement register 3"),
			new o("decr4", 		0x4C, _0, 			null, "decrement register 4"),
			new o("decr5", 		0x4D, _0, 			null, "decrement register 5"),
			new o("decr6", 		0x4E, _0, 			null, "decrement register 6"),
			new o("decr7", 		0x4F, _0, 			null, "decrement register 7"),

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

			// increments
			new o("incr0", 		0x40, _0, 			null, "increment r0 (ax?)"),
			new o("incr1", 		0x41, _0, 			null, "increment r1"),
			new o("incr2", 		0x42, _0, 			null, "increment r2"),
			new o("incr3", 		0x43, _0, 			null, "increment r3"),
			new o("incr4", 		0x44, _0, 			null, "increment register 4"),
			new o("incr5", 		0x45, _0, 			null, "increment register 5"),
			new o("incr6", 		0x46, _0, 			null, "increment register 6"),
			new o("incr7", 		0x47, _0, 			null, "increment register 7"),

			new o("int", 		0xCD, null, 		null, "call to interrupt"),
			new o("into", 		0xCE, null, 		null, "call to interrupt if overflow"),
			new o("iret", 		0xCF, null, 		null, "return from interrupt"),

			// j

			// jumps
			new o("jmp_w", 		0xE9, _16, 			null, "jump rel16"),
			new o("jmp_f", 		0xEA, null, 		null, "jump ptr16:16"),
			new o("jmp_b", 		0xEB, _8, 			null, "jump rel8"),
			new o("jo", 		0x70, null, 		null, "jump if 0"), 
			new o("jno", 		0x71, null, 		null, "jump if not 0"),
			new o("jb/nae/c", 	0x72, null, 		null, "jb/nae/c"),
			new o("jnb/ae/nc", 	0x73, null, 		null, "jnb/ae/nc"),
			new o("jz/e_b", 	0x74, _8, 			null, "jz/e_b"),
			new o("jz/e_w", 	0x0F, _8_16, 		null, "jz/e_w"),
			new o("jnz/ne", 	0x75, _8, 			null, "jnz/ne"),
			new o("jbe/na", 	0x76, null, 		null, "jbe/na"),
			new o("jnbe/a", 	0x77, null, 		null, "jnbe/a"),
			new o("js", 		0x78, null, 		null, "js"),
			new o("jns", 		0x79, null, 		null, "jns"),
			new o("jp/jpe", 	0x7A, null, 		null, "jp/jpe"),
			new o("jnp/po", 	0x7B, null, 		null, "jnp/po"),
			new o("jlt", 		0x7C, null, 		null, "jump if less than"),
			new o("jge", 		0x7D, null, 		null, "jump if greater than or equal"),
			new o("jle", 		0x7E, null, 		null, "jump if less than or equal"),
			new o("jgt", 		0x7F, null, 		null, "jump if greater than"),

			// l

			new o("lahf", 		0x9F, null, 		null, "load flags into ah"),
			new o("lds", 		0xC5, null, 		null, "load pointer using ds"),
			new o("lea", 		0x8D, null, 		null, "load effective address"),
			new o("les", 		0xC4, null, 		null, "load es with pointer"),
			new o("lock", 		0xF0, null, 		null, "assert bus loc# signal"),
			new o("lodsb", 		0xAC, null, 		null, "load string byte"),
			new o("lodsw", 		0xAD, null, 		null, "load string word"),

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
					new Opcode(0xB8, "move ax imm8"),
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
			new o("mov", r1iw" ], 	0xB9, movRead, movWrite, 	"move r1 imm16"),
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
			new o("or0", 		0x08, null, 		null, "or r/m8 r8"),
			new o("or1", 		0x09, null, 		null, "or r/m16 r16"),
			new o("or2", 		0x0A, null, 		null, "or r8 r/m8"),
			new o("or3", 		0x0B, null, 		null, "or r16 r/m16"),
			new o("or4", 		0x0C, null, 		null, "or al imm8"),
			new o("or5", 		0x0D, null, 		null, "or eax imm16"),
			new o("out0", 		0xEE, null, 		null, "out dx al"),
			new o("out1", 		0xEF, null, 		null, "out dx eax"),
			new o("outsb", 		0x6E, null, 		null, "output dx m8"),
			new o("outsw/d", 	0x6F, null, 		null, "output dx m16"),
			new o("pushds", 	0x1F, null, 		null, "push ds onto stack"),
			new o("popes", 		0x07, null, 		null, "pop es from stack"),

			// pops
			new o("popr0", 		0x58, null, 		null, "pop r0 (ax?) from stack"),
			new o("popr1", 		0x59, null, 		null, "pop r1 from stack"),
			new o("popr2", 		0x5A, null, 		null, "pop r2 from stack"),
			new o("popr3", 		0x5B, null, 		null, "pop r3 from stack"),
			new o("popr4", 		0x5C, null, 		null, "pop r4 from stack"),
			new o("popr5", 		0x5D, null, 		null, "pop r5 from stack"),
			new o("popr6", 		0x5E, null, 		null, "pop r6 from stack"),
			new o("popr7", 		0x5F, null, 		null, "pop r7 from stack"),
			new o("popss", 		0x17, null, 		null, "pop ss from stack"),
			new o("popf", 		0x9D, null, 		null, "pop flags register from stack"),

			// pushes
			new o("pushcs", 	0x0E, null, 		null, "push cs onto stack"),
			new o("pushds", 	0x1E, null, 		null, "push ds onto stack"),
			new o("pushes", 	0x06, null, 		null, "push es onto stack"),
			new o("pushr0", 	0x50, null, 		null, "push r0 (ax?) onto stack"),
			new o("pushr1", 	0x51, null, 		null, "push r1 onto stack"),
			new o("pushr2", 	0x52, null, 		null, "push r2 onto stack"),
			new o("pushr3", 	0x53, null, 		null, "push r3 onto stack"),
			new o("pushr4", 	0x54, null, 		null, "push r4 onto stack"),
			new o("pushr5", 	0x55, null, 		null, "push r5 onto stack"),
			new o("pushr6", 	0x56, null, 		null, "push r6 onto stack"),
			new o("pushr7", 	0x57, null, 		null, "push r7 onto stack"),
			new o("pushss", 	0x16, null, 		null, "push ss onto stack"),
			new o("pushf", 		0x9C, null, 		null, "push flags data onto stack"),

			new o("rep", 		0xF2, null, 		null, "repeat"), // rep, repe, repne, repnz, repz
			new o("retf0", 		0xCA, null, 		null, "return from procedure"),
			new o("retf1", 		0xCB, null, 		null, "return from procedure"),
			new o("retn0", 		0xC2, null, 		null, "return from near procedure"),
			new o("retn1", 		0xC3, null, 		null, "return from near procedure"),
			new o("shrotbi", 	0xC0, null, 		null, "shift/rotate r/m8 imm8"),
			new o("shrotwi", 	0xC1, null, 		null, "shift/rotate r/m16 imm8"),
			new o("shrotb1", 	0xD0, null, 		null, "shift/rotate r/m8 1"),
			new o("shrotw1", 	0xD1, null, 		null, "shift/rotate r/m16 1"),
			new o("sahf", 		0x9E, null, 		null, "store ah into flags"),

			// subtracts with borrow
			new o("sbb0", 		0x18, null, 		null, "subtraction with borrow r/m8 r8"),
			new o("sbb1", 		0x19, null, 		null, "subtraction with borrow r/m16 r16"),
			new o("sbb2", 		0x1A, null, 		null, "subtraction with borrow r8 r/m8"),
			new o("sbb3", 		0x1B, null, 		null, "subtraction with borrow r16 r/m16"),
			new o("sbb4", 		0x1C, null, 		null, "subtraction with borrow al imm8"),
			new o("sbb5", 		0x1D, null, 		null, "subtraction with borrow eax imm16"),

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
 
			// subtracts
			new o("sub0", 		0x28, null, 		null, "subtract r/m8 r8"),
			new o("sub1", 		0x29, null, 		null, "subtract r/m16 r16"),
			new o("sub2", 		0x2A, null, 		null, "subtract r8 r/m8"),
			new o("sub3", 		0x2B, null, 		null, "subtract r16 r/m16"),
			new o("sub4", 		0x2C, null, 		null, "subtract al imm8"),
			new o("sub5", 		0x2D, null, 		null, "subtract eax imm16"),

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
			new o("xor0", 		0x30, null, 		null, "xor r/m8 r8"),
			new o("xor1", 		0x31, null, 		null, "xor r/m16 r16"),
			new o("xor2", 		0x32, null, 		null, "xor r8 r/m8"),
			new o("xor3", 		0x33, null, 		null, "xor r16 r/m16"),
			new o("xor4", 		0x34, null, 		null, "xor al imm8"),
			new o("xor5", 		0x35, null, 		null, "xor eax imm16")
			*/
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

		var mnemonicAndOperands =
			assemblyCode.split(" ").map(x => x.split(",").join("")); 

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
			var operandSize = new OperandSize("data", dataToWriteAsString.length);
			var operandType = new OperandType(operandRole, operandSize);
			var operand = new Operand(operandType, dataToWriteAsString);
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

			var opcode = opcodeGroup.opcodeFromOperands(operands);
		}

		var instruction = new Instruction(opcode, operands);

		return instruction;
	}

	static opcodeValueFromOperands_Adc(operands)
	{
		var opcodeValue = null;

		var operand0 = operands[0];
		var operand1 = operands[1];

		// Ignore operand0, it's always al or ax.
		// Maybe that should be validated, though.
		var operand0Type = operand0.operandType;
		var operand0RoleName = operand0Type.role.name;
		var operand0SizeInBits = operand0Type.size.sizeInBits;

		var operand1Type = operand1.operandType;
		var operand1RoleName = operand1Type.role.name;
		var operand1SizeInBits = operand1Type.size.sizeInBits;

		var operandRolesAll = OperandRole.Instances();

		if (operand1RoleName == operandRolesAll.Immediate.name)
		{
			opcodeValue = (operand1SizeInBits == 8 ? 0x14 : 0x15);
		}
		else if (operand1RoleName == operandRolesAll.RegisterContents.name)
		{
			if (operand0RoleName == operandRolesAll.RegisterContents.name)
			{
				opcodeValue = (operand1SizeInBits == 8 ? 0x10 : 0x11);
			}
			else
			{
				throw("Unexpected operand role!");
			}
		}
		else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
		{
			throw("Unexpected operand role!");
		}
		else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
		{
			throw("Unexpected operand role!");
		}

		return opcodeValue;
	}

	static opcodeValueFromOperands_Mov(operands)
	{
		var opcodeValue = null;

		var operand0 = operands[0];
		var operand1 = operands[1];

		var operand0Type = operand0.operandType;
		var operand0RoleName = operand0Type.role.name;
		var operand0SizeInBits = operand0Type.size.sizeInBits;

		var operand1Type = operand1.operandType;
		var operand1RoleName = operand1Type.role.name;
		var operand1SizeInBits = operand1Type.size.sizeInBits;

		var operandRolesAll = OperandRole.Instances();

		if (operand0RoleName == operandRolesAll.Immediate.name)
		{
			throw("Unexpected operand role!");
		}
		else if (operand0RoleName == operandRolesAll.RegisterContents.name)
		{
			if (operand1RoleName == operandRolesAll.Immediate.name)
			{
				opcodeValue = 0xB8;
			}
			else if (operand1RoleName == operandRolesAll.RegisterContents.name)
			{
				opcodeValue = (operand0SizeInBits == 8 ? 0x88 : 0x89);
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
			{
				opcodeValue = (operand0SizeInBits == 8 ? 0x8A : 0x8B);
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
			{
				opcodeValue = (operand0SizeInBits == 8 ? 0x8A : 0x8B);
			}
		}
		else if (operand0RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
		{
			if (operand1RoleName == operandRolesAll.Immediate.Name)
			{
				throw("Not yet implemented!");
			}
			else if (operand1RoleName == operandRolesAll.RegisterContents.name)
			{
				opcodeValue = (operand0SizeInBits == 8 ? 0x88 : 0x89);
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
			{
				throw("Not yet implemented!");
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
			{
				throw("Not yet implemented!");
			}
		}
		else if (operand0RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
		{
			if (operand1RoleName == operandRolesAll.Immediate.Name)
			{
				throw("Not yet implemented!");
			}
			else if (operand1RoleName == operandRolesAll.RegisterContents.name)
			{
				opcodeValue = (operand0SizeInBits == 8 ? 0x88 : 0x89);
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegister.name)
			{
				throw("Not yet implemented!");
			}
			else if (operand1RoleName == operandRolesAll.MemoryAtAddressInRegisterPlusOffset.name)
			{
				throw("Not yet implemented!");
			}
		}

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
		var registerValuesByName = new Map
		([
			[ "al", 0 ],
			[ "ax", 0 ],
			[ "bx", 3 ],
			[ "cx", 1 ],
			[ "dx", 2 ]
		]);

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
				throw("todo");
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
		else if (operandAsString.length == 2)
		{
			operandRole = operandRoles.RegisterContents;

			var registerName = operandAsString;
			operandValue = registerValuesByName.get(registerName);
		}

		if (operandValue == null)
		{
			throw("Unrecognized operand: " + operandAsString);
		}

		var operandType = new OperandType(operandRole, operandSize);
		var returnOperand = new Operand(operandType, operandValue);

		return returnOperand;
	}

	static operandsReadFromBitStream_Mov(operands, bitStream)
	{
		throw("todo");
	}

	static instructionOperandsWriteToBitStream_Adc(instruction, bitStream)
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
				throw("todo");
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				throw("todo");
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
				throw("todo");
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				throw("todo");
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
		var operands = instruction.operands;

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
				throw("todo");
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				throw("todo");
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
				throw("todo");
			}
			else if (operand1Role == operandRolesAll.MemoryAtAddressInRegisterPlusOffset)
			{
				throw("todo");
			}
		}

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
}
