const fs = require("node:fs/promises");

async function readConfigBaseJson() {
let baseJson = {};
    try {
      const  str = await fs.readFile("./config.base.json",{encoding: "utf8"});
      baseJson = JSON.parse(str);
    } catch (err) {
        if (err.code === "ENOENT") {
             throw new Error("config.base.json is not defined");
        } else if (err.name === "SyntaxError") {
             throw new Error("config.base.json contains invalid JSON");
        } else {
             throw new Error("File system error" + err.message);
        }
    }
    return baseJson;
}

const stg = process.argv[2];

async function readConfigStagingJson() {
let stagingJson = {};
    try {
        const str = await fs.readFile("./config." + stg + ".json", {encoding: "utf8"});
        stagingJson = JSON.parse(str);

    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("File is not defined");
        } else if (err.name === "SyntaxError") {
            throw new Error("config.staging.json is not valid JSON");
        } else {
            throw new Error("File system error," + err.message);
        }
    }
    return stagingJson;
}

async function mergeJsonFiles() {
   const baseJson = await readConfigBaseJson();
   const stagingJson = await readConfigStagingJson();
   const str = JSON.stringify(merge(baseJson, stagingJson));

    await fs.writeFile("./config.final.json.tmp", str);
    await fs.rename("./config.final.json.tmp", "./config.final.json");
}


function merge(baseJson, stagingJson) {
    const stagingJsonKeys = Object.keys(stagingJson);

    for (const key of stagingJsonKeys) {
        if (baseJson[key] === null || stagingJson[key] === null){ 
            baseJson[key] = stagingJson[key];
        } else if (typeof baseJson[key] === "object" && typeof stagingJson[key] === "object" 
                && !Array.isArray(baseJson[key]) && !Array.isArray(stagingJson[key])) {
                        merge(baseJson[key], stagingJson[key]);
        } else {
            baseJson[key] = stagingJson[key];
        }
    } 
    return baseJson; 
}

mergeJsonFiles();
