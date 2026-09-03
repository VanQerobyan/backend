require("dotenv").config({quiet : true})
const net = require("node:net");

const PORT = process.env.PORT;
const HOST = process.env.HOST;


const player1 = "X";
const player2 = "O";
let turn = player1;
const map = new Map();

const board = new Array(9).fill("-");

function sendBoard() {
    for (const [player, socket] of map) {
        socket.write(
            `BOARD|\n` +
            `${board.slice(0, 3).join(" | ")}\n` +
            `-----------\n` +
            `${board.slice(3, 6).join(" | ")}\n` +
            `-----------\n` +
            `${board.slice(6, 9).join(" | ")}\n`
        );
    }
}

function winner() {
    if (
        (board[0] !== "-" && board[0] === board[1] && board[1] === board[2]) ||
        (board[3] !== "-" && board[3] === board[4] && board[4] === board[5]) ||
        (board[6] !== "-" && board[6] === board[7] && board[7] === board[8]) ||
        (board[0] !== "-" && board[0] === board[3] && board[3] === board[6]) ||
        (board[1] !== "-" && board[1] === board[4] && board[4] === board[7]) ||
        (board[2] !== "-" && board[2] === board[5] && board[5] === board[8]) ||
        (board[0] !== "-" && board[0] === board[4] && board[4] === board[8]) ||
        (board[2] !== "-" && board[2] === board[4] && board[4] === board[6])
    ) return true;
}


function switchPlayer(player) {
    if (player === player1) {
        player = player2;
    } else {
        player = player1;
    }
    return player;
}

function winPlayer(turn) {
    for (const [player, socket] of map) {
        socket.write(`WIN|${turn}\n`)
    }
}

function draw() {
    for (const [player, socket] of map) {
        socket.write(`DRAW\n`);
    }
}

function turnPlayer(turn) {
    for (const [player, socket] of map) {
        socket.write(`TURN|${turn}\n`);
    }
}
function gameEnd() {
    for (const [player, socket] of map) {
        socket.end();
    }
}


function check(firstCommand, socket) {
    if (firstCommand.startsWith("MOVE|")) {
            if (turn === socket.player) {
                let boardIndex = Number(firstCommand.slice(5));
                    if (boardIndex >= 0 && boardIndex <= 8) {
                        if (board[boardIndex] === "-") {
                            board[boardIndex] = turn;
                            if (winner()) {
                                sendBoard();
                                winPlayer(turn);
                                gameEnd();
                            } else  if (!board.includes("-")) {
                                sendBoard();
                                draw();
                                gameEnd();
                            } else {
                                sendBoard();
                                turn = switchPlayer(turn);
                                turnPlayer(turn);
                            }
                        } else {
                            socket.write("REJECTED|cell is occupied\n");
                        }   
                    } else {
                        socket.write("REJECTED|invalid cell\n");
                    }
            } else {
                socket.write("REJECTED|not your turn\n");
            }
    } else {
          socket.write("REJECTED|invalid command\n");
    }         
}


const server = net.createServer((socket) => {

        if (map.size === 0) {
            map.set(player1, socket);
            socket.player = player1;
            socket.write(`SYMBOL|${player1} \n`);
        } else if (map.size === 1) {
            map.set(player2, socket);
            socket.player = player2;
            socket.write(`SYMBOL|${player2}\n`);
        } else {
            socket.write("Server is full\n");
            socket.end();
        }

        if (map.size === 2) {
            sendBoard();
            for (const [player, socket] of map) {      
                socket.write("We start our game, you have to write the number (0-8), the game starts with player X\n");
            }
            turnPlayer(turn);
        }

        let buffer = "";
        socket.on("data", (data) => {

        buffer += data;

        while (buffer.includes("\n")) {
            let firstCommand = buffer.split("\n")[0];
            buffer = buffer.slice(firstCommand.length + 1);

            check(firstCommand, socket);  
        }
    })
    
    socket.on("close", ()=> {
        for (const [player, socket] of map) {
            if (player !== turn) {
                socket.write("OPPONENT_LEFT\n")
            }
        }
        console.log(`${turn} disconnected`)
    })
})

server.listen(PORT, HOST, () => {
    console.log(`Server listen to ${PORT}`);
})