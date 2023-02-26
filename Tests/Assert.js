
class Assert
{
	static areArraysEqual(array0, array1)
	{
		var areLengthsEqual = (array0.length == array1.length);
		var areElementsEqual =
			array0.some( (e0, i) => array1[i] != e0) == false;
		var areArraysEqual =
			areLengthsEqual && areElementsEqual;

		if (areArraysEqual == false)
		{
			throw new Error("Expected: equal, but was: not equal.");
		}
	}

	static areEqual(value0, value1)
	{
		if (value0 != value1)
		{
			throw new Error("Expected: equal, but was: not equal.");
		}
	}

	static fail(message)
	{
		throw new Error(message);
	}
}