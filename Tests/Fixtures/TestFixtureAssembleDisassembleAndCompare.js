class TestFixtureAssembleDisassembleAndCompare
{
	constructor()
	{
		this.name = "AssembleDisassembleAndCompare";

		this.instructionSetName = "x86";

		this.tests =
		[
			this.mov
		];
	}

	// Tests.

	mov()
	{
		this.mov_1_ImmediateToRegister();
		this.mov_2_RegisterToRegister_General();
		this.mov_3_RegisterToRegister_Special();
	}

	mov_1_ImmediateToRegister()
	{
		var codeToAssemble = `
			mov ax, 1
			mov ax, 2
			mov ax, 256
		`;

		this.assembleDisassembleAndCompare(codeToAssemble);
	}

	mov_2_RegisterToRegister_General()
	{
		var codeToAssemble = `
			mov ax, bx
			mov cx, dx
		`;

		this.assembleDisassembleAndCompare(codeToAssemble);
	}

	mov_3_RegisterToRegister_Special()
	{
		var codeToAssemble = `
			mov bp, bp
		`;

		this.assembleDisassembleAndCompare(codeToAssemble);
	}

	// Helper methods.

	assembleDisassembleAndCompare(codeToAssemble)
	{
		var programAssembled = Program.fromAssemblyCode
		(
			"[programAssembled]", this.instructionSetName, codeToAssemble
		);

		var programAssembledAsBytes = programAssembled.toBytes();

		var programParsedFromBytes = Program.fromBytes
		(
			"[programParsed]", this.instructionSetName, programAssembledAsBytes
		);

		var codeDisassembled =
			programParsedFromBytes.toStringAssemblyCode();

		// The original label names and comments are discarded during assembly.
		// So assemble and disassemble a second time,
		// so that the stripped code from the first disassembly
		// can be matched against the stripped code from the second disassembly.

		var programReassembled = Program.fromAssemblyCode
		(
			"[programReassembled]",
			this.instructionSetName,
			codeDisassembled
		);

		var programReassembledAsBytes = programReassembled.toBytes();
		Assert.areArraysEqual
		(
			programAssembledAsBytes, programReassembledAsBytes
		);

		var programReparsedFromBytes = Program.fromBytes
		(
			"[programReparsed]", this.instructionSetName, programReassembledAsBytes
		);

		var codeDisassembledAgain = programReparsedFromBytes.toStringAssemblyCode();

		if (codeDisassembledAgain != codeDisassembled)
		{
			Assert.Fail("Code was not the same before and after assembly and disassembly!");
		}
	}
}
