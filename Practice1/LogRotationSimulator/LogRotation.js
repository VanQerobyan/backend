const fs = require("fs/promises");
const paths = require("path");
const limit = 1000;

async function fileRename(fileName) {
    try{
    const stats = await fs.stat(fileName);
    if (stats.size > limit) {
        const { name, ext } = paths.parse(fileName);
        const archiveName = name + `-${new Date().toISOString().replace(/:/g, '-')}` + ext;
        await fs.rename(fileName, archiveName);
        await fs.writeFile(fileName, "");
        console.log("Rotated: " + archiveName + " (Fresh log created)");
    } else {
        console.log("Under the limit, no rotation needed");
    }

    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("No log file yet at " +  fileName + " -- nothing to rotate");
        } else {
            throw new Error("File system error: " +  err.message);
        }
    }
}

const filenName = process.argv[2];
fileRename(filenName);

