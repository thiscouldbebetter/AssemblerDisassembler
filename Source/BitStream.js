
class BitStream
{
	constructor(bytes)
	{
		this.bytes = bytes || [];
		this.byteOffset = 0;
		this.bitOffsetWithinByteCurrent = 0;
	}

	static BitsPerByte = 8;

	bitOffsetIncrement()
	{
		this.bitOffsetWithinByteCurrent++;
		if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte)
		{
			this.byteOffset++;
			this.bitOffsetWithinByteCurrent = 0;
		}
	}

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

		this.bitOffsetIncrement();

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

	writeAlignOnBoundary(bitModulusToAlignOn)
	{
		var bitOffsetAbsolute =
			this.byteOffset * BitStream.BitsPerByte
			+ this.bitOffsetWithinByteCurrent;
		var bitRemainder = bitOffsetAbsolute % bitModulusToAlignOn;
		var numberOfBitsToWrite =
			(bitRemainder == 0 ? 0 : bitModulusToAlignOn - bitRemainder);
		for (var i = 0; i < numberOfBitsToWrite; i++)
		{
			this.writeBit(0);
		}
	}

	writeBit(bitToWrite)
	{
		if (this.hasMoreBits() == false)
		{
			this.bytes.push(0);
		}

		var byteToWriteTo = this.bytes[this.byteOffset];
		var placesToShift =
			(BitStream.BitsPerByte - 1 - this.bitOffsetWithinByteCurrent);
		byteToWriteTo |= (bitToWrite << placesToShift);
		this.bytes[this.byteOffset] = byteToWriteTo;

		this.bitOffsetIncrement();
	}

	writeByte(byteToWrite)
	{
		this.writeIntegerUsingBitWidth(byteToWrite, BitStream.BitsPerByte);
	}

	writeBytes(bytesToWrite)
	{
		bytesToWrite.forEach(x => this.writeByte(x));
	}

	writeIntegerUsingBitWidth(integerToWrite, bitWidth)
	{
		// Note: this does not respect byte boundaries or endianness.
		// If that is desired, ByteStream should be used instead.
		for (var i = 0; i < bitWidth; i++)
		{
			var placesToShift = bitWidth - 1 - i;
			var bitToWrite = (integerToWrite >> placesToShift) & 1;
			this.writeBit(bitToWrite);
		}
	}

	writeString(stringToWrite)
	{
		for (var i = 0; i < stringToWrite.length; i++)
		{
			var charToWrite = stringToWrite.charCodeAt(i);
			this.writeByte(charToWrite);
		}
	}
}
