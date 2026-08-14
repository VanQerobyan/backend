const fs = require("fs");
const shift = Number(process.argv[2]);

const buffer = fs.readFileSync("./input.txt");
for (let i = 0; i < buffer.length; ++i) {
    let ch = buffer[i];
    if (ch >= 65 && ch <= 90){
         ch =  ((((ch - 65 + shift) % 26) + 26) % 26) + 65;
    } else if (ch >= 97 && ch <= 122) {
          ch = ((((ch - 97 + shift) % 26) + 26) % 26) + 97;
    } 
    buffer[i] = ch;
}
fs.writeFileSync("./output.txt", buffer);