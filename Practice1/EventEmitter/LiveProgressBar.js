const { EventEmitter } = require("stream");

class Downloader extends EventEmitter {
    constructor() {
        super();
        this.step = 0;
    }

    download() {
        const intervalId = setInterval(() => {
            this.step++;
            const filled = this.step * 10;
            this.emit("download", filled);

            if (filled === 100) {
                clearInterval(intervalId);
                this.emit("done");
            }
        },1000)
    }
}

const downloader = new Downloader();

downloader.on("download", (val) => {
    const filled = (val / 100) * 20;
    const ch = "#".repeat(filled);
    const lineCount = 20 - filled;
    const line = "-".repeat(lineCount);
    const downloadLine = ch + line;
    process.stdout.write(`\r[${downloadLine}]${val}%`);
})

downloader.on("done",() => {
    console.log("\nDownload completed");
})

downloader.download();