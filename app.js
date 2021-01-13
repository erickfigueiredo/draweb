const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const socketIo = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

const io = socketIo.listen(server);

let history = [];

io.on('connection', socket => {

    console.log(`Conexão inicializada: ID ${socket.id}`);

    history.forEach(line => socket.emit('draw', line));

    socket.on('clear', () => {
        history = new Array();
        io.emit('draw');
    });
    
    socket.on('draw', line => {
        history.push(line);
        io.emit('draw', line);
    });
});

server.listen(3000, () => console.log(`Servidor rodando em: http://localhost:3000`));