import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from "socket.io";
import { fork } from 'child_process';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

// Fork the Arduino process
const arduinoProcess = fork('./index.cjs');

//Static files (HTML, CSS, JS) from the public folder
app.use(express.static(join(__dirname, 'public')));

//Route for chat.html
app.get('/chat', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'chat.html'));
});

//for the arduino button click
arduinoProcess.on('message', (message) => {
    if (message.type === 'buttonEvent') {
        const numToSend = message.num;
        io.emit('but', numToSend);
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', ({msg, colour}) => {
        io.emit('chat message', {msg, colour});
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(9000, () => {
    console.log(`Server running at http://localhost:9000`);
});