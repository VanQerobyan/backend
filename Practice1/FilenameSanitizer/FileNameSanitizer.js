const fs = require("fs");
const path = require("path");

const inputFiles = fs.readdirSync("./Input");

for (const file of inputFiles) {
    const { name, ext } = path.parse(file);
    let lowerName = name.toLowerCase();
    lowerName = lowerName.replace(/[^a-z0-9]+/g, "-");
    lowerName = lowerName.replace(/^-+|-+$/g, "");
    const cleanExt = ext.toLowerCase()
    const fileName = lowerName + cleanExt; 
    const filePath = path.join("Input",file);
    const outputFilePath = path.join("Output", fileName);
    fs.mkdirSync("./Output", {recursive: true})
    fs.copyFileSync(filePath, outputFilePath);
}