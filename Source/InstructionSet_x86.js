
class InstructionSet_x86
{
	// Adapted from listings found at the following URLs:
	// https://en.wikipedia.org/wiki/X86_instruction_listings
	// http://ref.x86asm.net/coder32.html#xA5
	// http://www.felixcloutier.com/x86/
	// http://www.c-jump.com/CIS77/CPU/x86/lecture.html#X77_0120_encoding_add

	static build()
	{
		var io = InstructionOpcode;

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

		// Operand types codes used as mnemonic suffixes:
		// ----------------------------------------------
		// r = register
		// rm = register/memory
		// i = immediate

		// b - byte (8 bits)
		// w - word (16 bits)

		// a = al register assumed

		var _rmrb2_3_3 = InstructionSet_x86.operandsFromBitStream_rmrb2_3_3;
		var _rmrw2_3_3 = InstructionSet_x86.operandsFromBitStream_rmrw2_3_3;
		var _rrmb2_3_3 = InstructionSet_x86.operandsFromBitStream_rrmb2_3_3;
		var _rrmw2_3_3 = InstructionSet_x86.operandsFromBitStream_rrmw2_3_3;

		var opcodes	=
		[
			//     Mnemonic Code  Opds      Description
			//     -------- ----  ----      ---------------------------
			new io("aaa", 		0x37, _0, 			"ascii adjust al after add"),
			new io("aad", 		0xD5, _8, 			"ascii adjust ax before div"), // opds: Radix.
			new io("aam", 		0xD4, _8, 			"ascii adjust ax after mult"), // opds: Radix.
			new io("aas", 		0x3F, _0,			"ascii adjust al after sub"), // opds: Radix.

			// Add with carry.
			new io("adc_rmrb", 	0x10, _rmrb2_3_3, 	"add with carry r/m8 r8"),
			new io("adc_rrw", 	0x11, _rrmw2_3_3, 	"add with carry r/m16 r16"), 
			new io("adc_rrmb", 	0x12, _rrmb2_3_3, 	"add with carry r8 r/m8"),
			new io("adc_rrmw", 	0x13, _rrmw2_3_3, 	"add with carry r16 r/m16"),
			new io("adc_aib", 	0x14, _8, 			"add with carry al imm8"),
			new io("adc_aiw", 	0x15, _16, 			"add with carry eax imm16"),

			// adds
			new io("add_rmrb", 	0x00, _rmrb2_3_3, 	"add r/m8 r8"),
			new io("add_rrw", 	0x01, _rrmw2_3_3, 	"add r/m16 r16"),
			new io("add_rrmb", 	0x02, _rrmb2_3_3, 	"add r8 r/m8"),
			new io("add_rrmw", 	0x03, _rrmw2_3_3, 	"add r16 r/m16"),
			new io("add_aib", 	0x04, _8, 			"add al imm8"),
			new io("add_aiw", 	0x05, _16, 			"add eax imm16"),

			new io("and_rmrb", 	0x20, _rmrb2_3_3, 	"and r/m8 r8"),
			new io("and_rmrw", 	0x21, _rmrw2_3_3, 	"and r/m16 r16"),
			new io("and_rrmb", 	0x22, _rrmb2_3_3, 	"and r8 r/m8"),
			new io("and_rrmw", 	0x23, _rrmw2_3_3, 	"and r16 r/m16"),
			new io("and_aib", 	0x24, _8, 			"and al imm8"),
			new io("and_aiw", 	0x25, _16, 			"and eax imm16"),

			new io("arith0", 	0x80, null, 		"add,or,adc,sbb,and,sub,xor,cmp r/m8 imm8"),
			new io("arith1", 	0x81, null, 		"add,or,adc,sbb,and,sub,xor,cmp r/m16 imm16"),
			new io("arith2", 	0x82, null, 		"add,or,adc,sbb,and,sub,xor,cmp r/m8 imm8"),
			new io("arith3", 	0x83, null, 		"add,or,adc,sbb,and,sub,xor,cmp r/m16 imm8"),
			new io("arithf", 	0xD8, null, 		"add,mul,com,sub,subr,div,divr m32real"),

			new io("arpl", 		0x63, null, 		"adjust rpl field of segment selector"),

			// b
			new io("bound", 	0x52, null, 		"check index against bounds"),

			// c

			new io("call", 		0x9A, null, 		"call procedure"), // 0xE8, 0xFF/2, 0xFF/3
			new io("cbw", 		0x98, null, 		"convert byte to word"),

			// clears
			new io("clc", 		0xF8, _0, 			"clear carry flag"),
			new io("cld", 		0xFC, _0, 			"clear direction flag"),
			new io("cli", 		0xFA, _0, 			"clear interrupt flag"),

			new io("cmc", 		0xF5, _0, 			"complement carry flag"),

			// compares
			new io("cmp0", 		0x38, null, 		"compare r/m8 r8"), // 0x05, 0x80/0..., 0x83/0
			new io("cmp1", 		0x39, null, 		"compare r/m16 r16"),
			new io("cmp2", 		0x3A, null, 		"compare r8 r/m8"),
			new io("cmp3", 		0x3B, null, 		"compare r16 r/m16"),
			new io("cmp4", 		0x3C, null, 		"compare al imm8"),
			new io("cmp5", 		0x3D, null, 		"add eax imm16"),
			new io("cmpsb", 	0xA6, null, 		"compare bytes in memory"),
			new io("cmpsw", 	0xA7, null, 		"compare words"),

			new io("cwd", 		0x99, null, 		"convert word to doubleword"),

			// d

			// decimal adjusts
			new io("daa", 		0x27, null, 		"decimal adjust al after add"),
			new io("das", 		0x2F, null, 		"decimal adjust al after sub"),

			// decrements
			new io("decr0", 	0x48, _0, 			"decrement register 0 (ax?)"),
			new io("decr1", 	0x49, _0, 			"decrement register 1"),
			new io("decr2", 	0x4A, _0, 			"decrement register 2"),
			new io("decr3", 	0x4B, _0, 			"decrement register 3"),
			new io("decr4", 	0x4C, _0, 			"decrement register 4"),
			new io("decr5", 	0x4D, _0, 			"decrement register 5"),
			new io("decr6", 	0x4E, _0, 			"decrement register 6"),
			new io("decr7", 	0x4F, _0, 			"decrement register 7"),

			new io("div", 		0xF6, null, 		"unsigned divide"), // 0xF6/6, 0xF7/6

			// e

			new io("enter", 	0xC8, null, 		"make stack frame for procedure parameters"),
			//new io("esc", ?, null, "used with floating-point unit");

			// h

			new io("hlt", 		0xF4, null, 		"enter halt state"),

			// i

			new io("idiv", 		0XF6, null, 		"signed divide"), // 0xF6/7, 0xF7/7
			new io("imul", 		0x69, null, 		"signed multiply"), // 0x6B, 0xF6/5, 0xF7/5, 0x0FAF

			// ins
			new io("insb", 		0x6C, null, 		"input from port to string m8 dx"),
			new io("insw/d", 	0x6D, null, 		"input from port to string m16 dx"),
			new io("inb", 		0xE4, null, 		"input reg from port al imm8"),
			new io("ins", 		0xE5, null, 		"input reg from port eax imm16"),

			// increments
			new io("incr0", 	0x40, _0, 			"increment r0 (ax?)"),
			new io("incr1", 	0x41, _0, 			"increment r1"),
			new io("incr2", 	0x42, _0, 			"increment r2"),
			new io("incr3", 	0x43, _0, 			"increment r3"),
			new io("incr4", 	0x44, _0, 			"increment register 4"),
			new io("incr5", 	0x45, _0, 			"increment register 5"),
			new io("incr6", 	0x46, _0, 			"increment register 6"),
			new io("incr7", 	0x47, _0, 			"increment register 7"),

			new io("int", 		0xCD, null, 		"call to interrupt"),
			new io("into", 		0xCE, null, 		"call to interrupt if overflow"),
			new io("iret", 		0xCF, null, 		"return from interrupt"),

			// j

			// jumps
			new io("jmp_w", 	0xE9, _16, 			"jump rel16"),
			new io("jmp_f", 	0xEA, null, 		"jump ptr16:16"),
			new io("jmp_b", 	0xEB, _8, 			"jump rel8"),
			new io("jo", 		0x70, null, 		"jump if 0"), 
			new io("jno", 		0x71, null, 		"jump if not 0"),
			new io("jb/nae/c", 	0x72, null, 		"jb/nae/c"),
			new io("jnb/ae/nc", 0x73, null, 		"jnb/ae/nc"),
			new io("jz/e_b", 	0x74, _8, 			"jz/e_b"),
			new io("jz/e_w", 	0x0F, _8_16, 		"jz/e_w"),
			new io("jnz/ne", 	0x75, _8, 			"jnz/ne"),
			new io("jbe/na", 	0x76, null, 		"jbe/na"),
			new io("jnbe/a", 	0x77, null, 		"jnbe/a"),
			new io("js", 		0x78, null, 		"js"),
			new io("jns", 		0x79, null, 		"jns"),
			new io("jp/jpe", 	0x7A, null, 		"jp/jpe"),
			new io("jnp/po", 	0x7B, null, 		"jnp/po"),
			new io("jlt", 		0x7C, null, 		"jump if less than"),
			new io("jge", 		0x7D, null, 		"jump if greater than or equal"),
			new io("jle", 		0x7E, null, 		"jump if less than or equal"),
			new io("jgt", 		0x7F, null, 		"jump if greater than"),

			new io("lahf", 		0x9F, null, 		"load flags into ah"),
			new io("lds", 		0xC5, null, 		"load pointer using ds"),
			new io("lea", 		0x8D, null, 		"load effective address"),
			new io("les", 		0xC4, null, 		"load es with pointer"),
			new io("lock", 		0xF0, null, 		"assert bus loc# signal"),
			new io("lodsb", 	0xAC, null, 		"load string byte"),
			new io("lodsw", 	0xAD, null, 		"load string word"),

			// loops
			new io("loopnz", 	0xE0, null, 		"dec cx, jump if >0, zf 0"),
			new io("loopz", 	0xE1, null, 		"dec cx, jump if >0, zf 1"),
			new io("loopz", 	0xE2, null, 		"dec cx, jump if >0"),
			new io("jcxz", 		0xE3, null, 		"jump if cx 0"),

			// moves
			new io("mov_rmrb", 	0x88, _rmrb2_3_3, 	"move r/m8 r8"),
			new io("mov_rmrw", 	0x89, _rmrw2_3_3, 	"move r/m16 r16"),
			new io("mov_rrmb", 	0x8A, null, 		"move r8 r/m8"),
			new io("mov_rrmw", 	0x8B, _rrmw2_3_3, 	"move r16 r/m16"),
			new io("mov_rmwseg",0x8C, _16, 			"move r/m16 Sreg"),
			new io("mov_segrmw",0x8E, null, 		"move Sreg r/m16"),
			new io("mov_sb", 	0xA4, null, 		"move byte from string to string"),
			new io("mov_sw", 	0xA5, null, 		"move word from string to string"),
			new io("mov_r0i8", 	0xB0, null, 		"move r0 (ax?) imm8"),
			new io("mov_r1i8", 	0xB1, null, 		"move r1 imm8"),
			new io("mov_r2i8", 	0xB2, null, 		"move r2 imm8"),
			new io("mov_r3i8", 	0xB3, null, 		"move r3 imm8"),
			new io("mov_r4i8", 	0xB4, null, 		"move r4 imm8"),
			new io("mov_r5i8", 	0xB5, null, 		"move r5 imm8"),
			new io("mov_r6i8", 	0xB6, null, 		"move r6 imm8"),
			new io("mov_r7i8", 	0xB7, null, 		"move r7 imm8"),
			new io("mov_16r0", 	0xB8, null, 		"move r0 (ax?) imm16"),
			new io("mov_r1iw", 	0xB9, null, 		"move r1 imm16"),
			new io("mov_r2iw", 	0xBA, null, 		"move r2 imm16"),
			new io("mov_r3iw", 	0xBB, null, 		"move r3 imm16"),
			new io("mov_r4iw", 	0xBC, null, 		"move r4 imm16"),
			new io("mov_r5iw", 	0xBD, null, 		"move r5 imm16"),
			new io("mov_r6iw", 	0xBE, null, 		"move r6 imm16"),
			new io("mov_r7iw", 	0xBF, null, 		"move r7 imm16"),

			//new io("mul", ?, null, "unsigned multiply"),
			//new io("neg", ?, null, "two's complement negation),
			new io("nop", 		0x90, null, 		"no operation"),
			//new io("not", ?, null, "logical not"),
			new io("or0", 		0x08, null, 		"or r/m8 r8"),
			new io("or1", 		0x09, null, 		"or r/m16 r16"),
			new io("or2", 		0x0A, null, 		"or r8 r/m8"),
			new io("or3", 		0x0B, null, 		"or r16 r/m16"),
			new io("or4", 		0x0C, null, 		"or al imm8"),
			new io("or5", 		0x0D, null, 		"or eax imm16"),
			new io("out0", 		0xEE, null, 		"out dx al"),
			new io("out1", 		0xEF, null, 		"out dx eax"),
			new io("outsb", 	0x6E, null, 		"output dx m8"),
			new io("outsw/d", 	0x6F, null, 		"output dx m16"),
			new io("pushds", 	0x1F, null, 		"push ds onto stack"),
			new io("popes", 	0x07, null, 		"pop es from stack"),

			// pops
			new io("popr0", 	0x58, null, 		"pop r0 (ax?) from stack"),
			new io("popr1", 	0x59, null, 		"pop r1 from stack"),
			new io("popr2", 	0x5A, null, 		"pop r2 from stack"),
			new io("popr3", 	0x5B, null, 		"pop r3 from stack"),
			new io("popr4", 	0x5C, null, 		"pop r4 from stack"),
			new io("popr5", 	0x5D, null, 		"pop r5 from stack"),
			new io("popr6", 	0x5E, null, 		"pop r6 from stack"),
			new io("popr7", 	0x5F, null, 		"pop r7 from stack"),
			new io("popss", 	0x17, null, 		"pop ss from stack"),
			new io("popf", 		0x9D, null, 		"pop flags register from stack"),

			// pushes
			new io("pushcs", 	0x0E, null, 		"push cs onto stack"),
			new io("pushds", 	0x1E, null, 		"push ds onto stack"),
			new io("pushes", 	0x06, null, 		"push es onto stack"),
			new io("pushr0", 	0x50, null, 		"push r0 (ax?) onto stack"),
			new io("pushr1", 	0x51, null, 		"push r1 onto stack"),
			new io("pushr2", 	0x52, null, 		"push r2 onto stack"),
			new io("pushr3", 	0x53, null, 		"push r3 onto stack"),
			new io("pushr4", 	0x54, null, 		"push r4 onto stack"),
			new io("pushr5", 	0x55, null, 		"push r5 onto stack"),
			new io("pushr6", 	0x56, null, 		"push r6 onto stack"),
			new io("pushr7", 	0x57, null, 		"push r7 onto stack"),
			new io("pushss", 	0x16, null, 		"push ss onto stack"),
			new io("pushf", 	0x9C, null, 		"push flags data onto stack"),

			new io("rep", 		0xF2, null, 		"repeat"), // rep, repe, repne, repnz, repz
			new io("retf0", 	0xCA, null, 		"return from procedure"),
			new io("retf1", 	0xCB, null, 		"return from procedure"),
			new io("retn0", 	0xC2, null, 		"return from near procedure"),
			new io("retn1", 	0xC3, null, 		"return from near procedure"),
			new io("shrotbi", 	0xC0, null, 		"shift/rotate r/m8 imm8"),
			new io("shrotwi", 	0xC1, null, 		"shift/rotate r/m16 imm8"),
			new io("shrotb1", 	0xD0, null, 		"shift/rotate r/m8 1"),
			new io("shrotw1", 	0xD1, null, 		"shift/rotate r/m16 1"),
			new io("sahf", 		0x9E, null, 		"store ah into flags"),

			// subtracts with borrow
			new io("sbb0", 		0x18, null, 		"subtraction with borrow r/m8 r8"),
			new io("sbb1", 		0x19, null, 		"subtraction with borrow r/m16 r16"),
			new io("sbb2", 		0x1A, null, 		"subtraction with borrow r8 r/m8"),
			new io("sbb3", 		0x1B, null, 		"subtraction with borrow r16 r/m16"),
			new io("sbb4", 		0x1C, null, 		"subtraction with borrow al imm8"),
			new io("sbb5", 		0x1D, null, 		"subtraction with borrow eax imm16"),

			new io("scasb", 	0xAE, null, 		"compare byte string"),
			new io("scasw", 	0xAF, null, 		"compare word string"),
			new io("seges", 	0x26, null, 		"es prefix"),
			new io("segcs", 	0x2E, null, 		"cs prefix"),
			new io("segds", 	0x3E, null, 		"ds prefix"),
			new io("stc", 		0xF9, null, 		"set carry flag"),
			new io("std", 		0xFD, null, 		"set direction flag"),
			new io("sti", 		0xFB, null, 		"set interrupt flag"),
			new io("stosb", 	0xAA, null, 		"store byte in string"),
			new io("stosw", 	0xAB, null, 		"store word in string"),
 
			// subtracts
			new io("sub0", 		0x28, null, 		"subtract r/m8 r8"),
			new io("sub1", 		0x29, null, 		"subtract r/m16 r16"),
			new io("sub2", 		0x2A, null, 		"subtract r8 r/m8"),
			new io("sub3", 		0x2B, null, 		"subtract r16 r/m16"),
			new io("sub4", 		0x2C, null, 		"subtract al imm8"),
			new io("sub5", 		0x2D, null, 		"subtract eax imm16"),

			new io("wait", 		0x9B, null, 		"wait until not busy"),

			// exchanges
			new io("xchgr0", 	0x90, null, 		"exchange r0 16 eAX"),
			new io("xchgr1", 	0x90, null, 		"exchange r1 16 eAX"),
			new io("xchgr2", 	0x90, null, 		"exchange r2 16 eAX"),
			new io("xchgr3", 	0x90, null, 		"exchange r3 16 eAX"),
			new io("xchgr4", 	0x90, null, 		"exchange r4 16 eAX"),
			new io("xchgr5", 	0x90, null, 		"exchange r5 16 eAX"),
			new io("xchgr6", 	0x90, null, 		"exchange r6 16 eAX"),
			new io("xchgr7", 	0x90, null, 		"exchange r7 16 eAX"),
			new io("xchgrrb", 	0x86, null, 		"exchange registers 8"),
			new io("xchgrrw", 	0x86, null, 		"exchange registers 16"),

			new io("xlat", 		0xD7, null, 		"table look-up translation"),
			new io("xor0", 		0x30, null, 		"xor r/m8 r8"),
			new io("xor1", 		0x31, null, 		"xor r/m16 r16"),
			new io("xor2", 		0x32, null, 		"xor r8 r/m8"),
			new io("xor3", 		0x33, null, 		"xor r16 r/m16"),
			new io("xor4", 		0x34, null, 		"xor al imm8"),
			new io("xor5", 		0x35, null, 		"xor eax imm16")
		];

		var instructionSet = new InstructionSet("x86", opcodes);

		return instructionSet;
	}

	// Operand parsing methods.

	// 8-bit operands (al, bl...) ("b" = "byte")

	static operandsFromBitStream_rrmb2_3_3(s)
	{
		var operandAddressingMode = s.readBitsAsInteger(2);

		var operandsAsIntegers =
		[
			s.readBitsAsInteger(3),
			s.readBitsAsInteger(3)
		];

		var operandsAsStrings = operandsAsIntegers.map(
			x => Register.byCodeAndWidthInBits(x, 8).name
		); // todo

		if (operandAddressingMode == 0)
		{}
		else if (operandAddressingMode == 1)
		{
			// mov ax, [bx+1]
			var offset = s.readByte();
			operandsAsStrings[1] += "+" + offset;
		}
		else if (operandAddressingMode == 2)
		{}
		else // (operandAddressingMode == 4)
		{}

		operandsAsStrings = operandsAsStrings.map
		(
			x => x + (x.startsWith("[") ? "]" : "")
		);

		return operandsAsStrings;
	}

	static operandsFromBitStream_rmrb2_3_3(s)
	{
		return InstructionSet_x86.operandsFromBitStream_rrmb2_3_3(s).reverse();
	}

	// 16-bit operands (ax, bx...) ("w" = "word")

	static operandsFromBitStream_rrmw2_3_3(s)
	{
		var operandAddressingMode = s.readBitsAsInteger(2);

		var operandsAsIntegers =
		[
			s.readBitsAsInteger(3),
			s.readBitsAsInteger(3)
		];

		var operandsAsStrings = operandsAsIntegers.map
		(
			x => Register.byCodeAndWidthInBits(x, 16).name
		); // todo

		if (operandAddressingMode == 0)
		{}
		else if (operandAddressingMode == 1)
		{
			// mov ax, [bx+1]
			var offset = s.readByte();
			operandsAsStrings[1] += "+" + offset;
		}
		else if (operandAddressingMode == 2)
		{}
		else // (operandAddressingMode == 4)
		{}

		operandsAsStrings = operandsAsStrings.map
		(
			x => x + (x.startsWith("[") ? "]" : "")
		);

		return operandsAsStrings;
	}

	static operandsFromBitStream_rmrw2_3_3(s)
	{
		return InstructionSet_x86.operandsFromBitStream_rrmw2_3_3(s).reverse();
	}

}
