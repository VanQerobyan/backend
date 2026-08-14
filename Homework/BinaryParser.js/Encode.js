const fs = require("fs");

const recCount = 14;

const fileBuffer = Buffer.alloc(7 + (9 * recCount));

//header
fileBuffer.write("SNSR", 0);

//version
fileBuffer.writeUInt8(1, 4);

//records count
fileBuffer.writeUInt16BE(recCount, 5);

//timestamp
fileBuffer.writeUInt32BE(Math.floor(Math.random() * 20), 7);

//temperature
fileBuffer.writeFloatBE(Math.floor(Math.random() * 100), 11);

//ID
fileBuffer.writeUInt8(Math.floor(Math.random() * 10), 15);

let offset = 16;

    while (offset < fileBuffer.length) {
        fileBuffer.writeUInt32BE(Math.floor(Math.random() * 20), offset);
        offset += 4;
        fileBuffer.writeFloatBE(Math.floor(Math.random() * 100) , offset);
        offset += 4;
        fileBuffer.writeUInt8(Math.floor(Math.random() * 10), offset);
        ++offset;
    }

const res = fs.writeFileSync("./records.bin", fileBuffer);