const fs = require("fs");  

const result = [];
const buf = fs.readFileSync("./records.bin");

const header = buf.slice(0, 4);

    if (!header.equals(Buffer.from("SNSR"))) {
        throw new Error("Header is invalid");
    } 
    if(!(buf.readUInt8(4) === 1)) {
        throw new Error("Version is invalid");
    }

    
    const recCount = buf.readUInt16BE(5);

    let offset = 7;
    let idx = 0;
    
    while (idx < recCount) { 
        const date = buf.readUInt32BE(offset);
        offset += 4;
        const timestamp = new Date(date * 1000);
        const temperature = buf.readFloatBE(offset);
        offset += 4;
        const sensorId = buf.readUInt8(offset);
        result.push({
            timestamp,
            temperature,
            sensorId
        })
        offset += 1;
        ++idx;
    }
   
    let temperatureAvg = 0;
    const map = new Map();

    for (let i = 0; i < result.length; ++i) {
        let records = result[i];
        temperatureAvg += records.temperature;

        if (map.has(records.sensorId)) {
            map.set(records.sensorId, map.get(records.sensorId) + 1);
        } else {
            map.set(records.sensorId, 1);
        }
    }

    
    let maxRecord = -Infinity;  
    let sensorID = 0;

    for (const val of result) {
        let records = val;
       if (maxRecord < map.get(records.sensorId)) {
            maxRecord = map.get(records.sensorId);
            sensorID = val.sensorId;
        }
}

console.log("File format valid (SNSR v1)")
console.log("Records parsed: " + buf.readUInt16BE(5));
console.log("Average temperature: ", temperatureAvg/recCount + "°C");
console.log("Most active sensor: #" + sensorID  + " (" + maxRecord + " readings)"); 