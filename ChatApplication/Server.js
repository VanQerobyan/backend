const net = require("node:net");
const { buffer } = require("node:stream/consumers");

const map = new Map();


const server = net.createServer(socket => {
    let messageBuffer = "";

    let username = undefined;

    socket.write("Enter username: ");

    socket.on("data", (data) => {

        let message = "";
        messageBuffer += data;
        let j = 0;
        while (j < messageBuffer.length) {
            
        if (messageBuffer[j] === "\n") {
                
            if (!username) {

                username = message;

            if (username.trim().length === 0) {
                    socket.write("This username is invalid.Enter a new username.");
                    messageBuffer = "";
                    username = undefined; 
                    continue;
                }

                if(map.has(username)){
                    username = undefined;
                    socket.write("This username already exists. Enter a new username.");
                } else {
                    map.set(username, socket);
                }
            } else {

            if (message.startsWith("/msg ")) {

            //DM
            let receiverUsername = "";
            let sendMessage = "";
            let spaceCount = 0; 
                for (let i = 0; i < message.length; ++i) {
                    if (message[i] === " ") {
                        sendMessage += message[i];
                        spaceCount++;
                        continue;
                    }
                    if (spaceCount === 1) {
                        receiverUsername += message[i];
                    } else  if(spaceCount >= 2){
                        sendMessage += message[i];
                    }
                }

                if (map.has(receiverUsername)) {

                    const receiver = map.get(receiverUsername);

                    receiver.write(`DM from ${username}: ${sendMessage}`);
                    socket.write(`[You -> ${receiverUsername}]:` + sendMessage);
                } else {
                    socket.write(`User ${receiverUsername} not found`)
                }  
            //Who is connect server     
            } else if (message.startsWith("/who")) {
                const users = [];
                for (const user of map) {
                     users.push(user[0]);
                }
                    socket.write(users.join(" "))
                
            //Quite        
            }else if (message === "/quit") {
                    socket.end();
                    for (const users of map) {
                        if (users[0] !== username) {
                            const receiver = map.get(users[0]);
                            receiver.write(`${username} left to chat`);
                        }
                    }

            } else {

                //Broadcast
                for (const user of map) {
                    if (user[0] !== username) {
                        const receiver = map.get(user[0]);
                        receiver.write(`Message from ${username}: ${message}`);
                    }
                }
            }
            }
                messageBuffer = messageBuffer.replace(message + "\n","");
                message = "";
                j = 0;
        } else {
            message += messageBuffer[j];
            ++j;
        }
    }    
})

    socket.on("close", () => {
        map.delete(username);
    })

    socket.on("error", (err) => { 
        console.log(`${username} connection error.`);
    })

})

server.listen(3000, () => {
    console.log("Server is connected")
})
