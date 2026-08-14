const fs = require("fs");
const fileName = process.argv[2];
const stream = fs.createReadStream(fileName, { encoding: "utf8" });

let bytes = 0;
let wordCount = 0;
let ch = " ";

stream.on("data", (chunk) => {
  processChunk(chunk);
});

stream.on("end", () => {
    if (ch !== " "  && ch !== "\t" && ch !== "\n" && ch !== "\r") {
        wordCount++;
    }
  console.log("Words: " + wordCount);
  console.log("Bytes processed: " + bytes);
  console.log("Stream is ending");
});

function processChunk(chunk) {
  for (let i = 0; i < chunk.length; ++i) {
     if (chunk[i] === " "  || chunk[i] === "\t" || chunk[i] === "\n" || chunk[i] === "\r") {
        if (ch !== " "  && ch !== "\t" && ch !== "\n" && ch !== "\r") {
            wordCount++;
         } 
      }
    ch = chunk[i];
    }
     bytes += chunk.length;
  }
 