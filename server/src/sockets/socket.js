let ioInstance = null;

function initSocket(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: { origin: '*' }
  });

  ioInstance.on('connection', (socket) => {
    console.log('[Socket.io] Client connected:', socket.id);
  });
}

function getIo() {
  return ioInstance;
}

module.exports = { initSocket, getIo };
