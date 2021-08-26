
class BitStream
{
	constructor(bytes)
	{
		this.bytes = bytes;
		this.byteOffset = 0;
		this.bitOffsetWithinByteCurrent = 0;
	}

	static BitsPerByte = 8;

	hasMoreBits()
	{
		return (this.byteOffset < this.bytes.length);
	}

	readBit()
	{
		var byteToReadFrom = this.bytes[this.byteOffset];
		var placesToShift =
			(BitStream.BitsPerByte - 1 - this.bitOffsetWithinByteCurrent);
		var bitRead = (byteToReadFrom >> placesToShift) & 1;

		this.bitOffsetWithinByteCurrent++;
		if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte)
		{
			this.byteOffset++;
			this.bitOffsetWithinByteCurrent = 0;
		}

		return bitRead;
	}

	readBits(numberOfBits)
	{
		var bitsRead = [];

		for (var i = 0; i < numberOfBits; i++)
		{
			var bit = this.readBit();
			bitsRead.push(bit);
		}

		return bitsRead;
	}

	readBitsAsInteger(numberOfBits)
	{
		var returnValue = 0;
		for (var i = 0; i < numberOfBits; i++)
		{
			var bit = this.readBit();
			returnValue = (returnValue << 1) + bit;
		}
		return returnValue;
	}

	readByte()
	{
		var byteRead = this.bytes[this.byteOffset];
		this.byteOffset++;
		return byteRead;
	}

	readBytes(byteCount)
	{
		var returnValues = [];
		for (var i = 0; i < byteCount; i++)
		{
			returnValues.push(this.readByte());
		}
		return returnValues;
	}

	readBytesAsIntegerLittleEndian(byteCount)
	{
		var bytesRead = this.readBytes(byteCount);
		var returnValue =
			(bytesRead[1] << BitStream.BitsPerByte) | bytesRead[0];
		return returnValue;
	}
}
