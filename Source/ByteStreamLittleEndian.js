
class ByteStreamLittleEndian
{
	constructor(bytes)
	{
		this.bytes = bytes;

		this.byteOffset = 0; // Assume reading.
	}

	readByte()
	{
		var byteRead = this.bytes[this.byteOffset];
		this.byteOffset++;
		return byteRead;
	}

	readIntegerWithWidthInBytes(widthInBytes)
	{
		var resultSoFar = 0;

		for (var i = 0; i < widthInBytes; i++)
		{
			var byteRead = this.readByte();
			var valueForByte = byteRead << (8 * i);
			resultSoFar = resultSoFar | valueForByte;
		}

		return resultSoFar;
	}

	writeByte(byteToWrite)
	{
		this.bytes[this.byteOffset] = byteToWrite;
		this.byteOffset++;
	}

	writeIntegerWithWidthInBytes(integerToWrite, widthInBytes)
	{
		var valueRemaining = integerToWrite;

		for (var i = 0; i < widthInBytes; i++)
		{
			var byteLowestRemaining = valueRemaining & 0xFF;
			this.writeByte(byteLowestRemaining);
			valueRemaining = valueRemaining >> 8;
		}
	}
}
