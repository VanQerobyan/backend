require("dotenv").config({quiet : true})

const net = require("node:net");

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const client = net.createConnection(PORT, HOST, ()=> {

    process.stdin.on("data", (data) => {
        client.write(`MOVE|${data.toString()}`);
    })
})

client.on("data", (data) => {
    console.log(data.toString());
})