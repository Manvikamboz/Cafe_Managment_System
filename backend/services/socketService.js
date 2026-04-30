let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('joinOrder', (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined order room: ${orderId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  emitOrderStatus: (orderId, status) => {
    if (io) {
      io.to(orderId.toString()).emit('orderStatusUpdated', { orderId, status });
    }
  },
};
