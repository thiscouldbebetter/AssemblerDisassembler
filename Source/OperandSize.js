
class OperandSize
{
	constructor(name, sizeInBits)
	{
		this.name = name;
		this.sizeInBits = sizeInBits;
	}

	static fromNameAndSizeInBits(name, sizeInBits)
	{
		return new OperandSize(name, sizeInBits);
	}

	static Instances()
	{
		if (OperandSize._instances == null)
		{
			OperandSize._instances = new OperandSize_Instances();
		}
		return OperandSize._instances;
	}

	static fromOperandAsString(operandAsString)
	{
		var returnSize = null;

		var operandSizes = OperandSize.Instances();

		if (operandAsString.indexOf("e") >= 0)
		{
			returnSize = operandSizes.ThreeBits;
		}
		else if (operandAsString.indexOf("x") >= 0)
		{
			returnSize = operandSizes.ThreeBits;
		}
		else
		{
			returnSize = operandSizes.ThreeBits;
		}

		return returnSize;
	}
}

class OperandSize_Instances
{
	constructor()
	{
		this.Byte = new OperandSize
		(
			"Byte", 8
		);

		this.DoubleWord = new OperandSize
		(
			"Double-word", 16
		);

		this.ElevenBits = new OperandSize
		(
			"ElevenBits", 11
		);

		this.ThreeBits = new OperandSize
		(
			"ThreeBits", 3
		);

		this.Word = new OperandSize
		(
			"Word", 16
		);

		this._All = 
		[
			this.Byte,
			this.DoubleWord,
			this.ElevenBits,
			this.ThreeBits,
			this.Word,
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x]));
	}
}
