const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Eatery = require('../models/Eatery');
const socketService = require('../services/socketService');

// Simulated Swiggy Courier dispatch and delivery tracking updates in the background
const simulateSwiggyDelivery = (orderId) => {
  // 1. After 5 seconds, Chef is Preparing
  setTimeout(async () => {
    try {
      const order = await Order.findById(orderId);
      if (order && order.status === 'pending') {
        order.status = 'preparing';
        await order.save();
        socketService.emitOrderStatus(orderId, 'preparing');
        console.log(`[Swiggy API Simulation] Order ${orderId} status: preparing`);

        // 2. After another 8 seconds, Courier is out for delivery
        setTimeout(async () => {
          try {
            const order2 = await Order.findById(orderId);
            if (order2 && order2.status === 'preparing') {
              order2.status = 'out-for-delivery';
              await order2.save();
              socketService.emitOrderStatus(orderId, 'out-for-delivery');
              console.log(`[Swiggy API Simulation] Order ${orderId} status: out-for-delivery`);

              // 3. After another 10 seconds, Courier has delivered
              setTimeout(async () => {
                try {
                  const order3 = await Order.findById(orderId);
                  if (order3 && order3.status === 'out-for-delivery') {
                    order3.status = 'delivered';
                    await order3.save();
                    socketService.emitOrderStatus(orderId, 'delivered');
                    console.log(`[Swiggy API Simulation] Order ${orderId} status: delivered`);
                  }
                } catch (err) {
                  console.error('Error in Swiggy simulation stage 3:', err);
                }
              }, 10000);
            }
          } catch (err) {
            console.error('Error in Swiggy simulation stage 2:', err);
          }
        }, 8000);
      }
    } catch (err) {
      console.error('Error in Swiggy simulation stage 1:', err);
    }
  }, 5000);
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, eatery } = req.body;

  if (!eatery) {
    res.status(400);
    throw new Error('Eatery ID is required for placing an order');
  }

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      eatery,
      totalPrice,
    });

    const createdOrder = await order.save();
    
    // Trigger simulated Swiggy delivery flow
    simulateSwiggyDelivery(createdOrder._id);

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('eatery');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('eatery')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders (optionally filtered by eatery)
// @route   GET /api/orders
// @access  Private/Admin/Staff
const getOrders = asyncHandler(async (req, res) => {
  let query = {};
  
  // If user is a staff member, they can only see orders for eateries they own/manage
  if (req.user.role === 'staff') {
    const managedEateries = await Eatery.find({ owner: req.user._id });
    const eateryIds = managedEateries.map(e => e._id);
    query.eatery = { $in: eateryIds };
  } else if (req.query.eateryId) {
    query.eatery = req.query.eateryId;
  }

  const orders = await Order.find(query)
    .populate('user', 'id name')
    .populate('eatery')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Staff
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    
    // Emit real-time update via Socket.io
    socketService.emitOrderStatus(order._id, status);
    
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};
