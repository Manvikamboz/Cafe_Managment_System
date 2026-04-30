const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');

// @desc    Process chatbot message
// @route   POST /api/chatbot/message
// @access  Public
const processMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();

  let response = "";

  if (lowerMsg.includes("menu") || lowerMsg.includes("recommend") || lowerMsg.includes("eat")) {
    const items = await MenuItem.find({ isAvailable: true }).limit(3);
    if (items.length > 0) {
      const itemNames = items.map(i => i.name).join(", ");
      response = `Our baristas highly recommend trying the ${itemNames} today! Would you like me to add one to your cart?`;
    } else {
      response = "Our seasonal menu is currently being updated. Check back in a few minutes for fresh arrivals!";
    }
  } else if (lowerMsg.includes("order") || lowerMsg.includes("track")) {
    response = "Your order is our priority! You can see the real-time progress of your brew in the 'My Orders' section.";
  } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
    response = "Hello! Welcome to the Smart Café. I'm here to help you find your perfect brew or track your current order. What's on your mind?";
  } else if (lowerMsg.includes("price") || lowerMsg.includes("cost")) {
    response = "We offer premium quality at artisanal prices. You can view the full pricing breakdown in our Gourmet Menu section.";
  } else {
    response = "That sounds interesting! I can help you with menu recommendations, order status updates, or find our nearest branch. How can I assist?";
  }

  res.json({ response });
});

module.exports = { processMessage };
