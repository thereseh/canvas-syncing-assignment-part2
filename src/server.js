// attempt to use express, I guess it's working
const express = require('express');

const app = express();

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const path = require('path');

const server = require('http').createServer(app);

const socketio = require('socket.io');

const shape = {};

// not sure if this is supposed to be better than the way you showed us
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../client/index.html`));
});

server.listen(PORT);

const io = socketio(server);

io.on('connection', (socket) => {
  socket.join('room1');
  // if the client joins late and there are currently
  // shapes in the object
  if (Object.keys(shape).length > 0) {
    socket.emit('updateCanvas', shape);
  }
  // when a client draws a shape, the server is told
  // broadcast the info to everyone else
  socket.on('addShape', (data) => {
    const coords = data.coords;
    shape[data.time] = { x: coords.x, y: coords.y, width: 50, height: 50, color: 'red' };
    socket.broadcast.emit('fromServer', { time: data.time, coords: data.coords });
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`listening on port ${PORT}`);
