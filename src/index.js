const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.emit('serverMsg', 'Welcome!');
    socket.broadcast.emit('serverMsg', 'New user has joined');

    socket.on('clientSendMsg', (msg, callback) => {
        const filter = new Filter();

        if ( filter.isProfane(msg) ) {
            return callback('Profanity is not allowed');
        }

        io.emit('serverMsg', msg);
        callback();
    });

    socket.on('clientSendLocation', ({ latitude, longitude }, callback) => {
        io.emit('serverMsg', `https://google.com/maps?q=${latitude},${longitude}`);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('serverMsg', 'A user has left');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});