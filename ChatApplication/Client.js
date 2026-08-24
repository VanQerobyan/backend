const net = require("node:net");

const client = net.createConnection(3000, "127.0.0.1", () => {
    console.log("Client connected");
})


client.on("data", (data) => {
       console.log(data.toString());
})

process.stdin.on("data", (data) => {
    client.write(data.toString());
})