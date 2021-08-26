
class InstructionOpcode
{
	constructor
	(
		mnemonic, value, operandWidthsInBits, description
	)
	{
		this.mnemonic = mnemonic;
		this.value = value;
		this.operandWidthsInBits = 
			operandWidthsInBits || [2, 3, 3];
		this.description = description || "";
	}

	static Instances()
	{
		if (InstructionOpcode._instances == null)
		{
			InstructionOpcode._instances =
				new InstructionOpcode_Instances();
		}
		return InstructionOpcode._instances;
	}
}
