const asyncHandler = require('express-async-handler');
const Eatery = require('../models/Eatery');
const MenuItem = require('../models/MenuItem');

// @desc    Process chatbot message
// @route   POST /api/chatbot/message
// @access  Public
const processMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();

  let response = "";

  if (lowerMsg.includes("menu") || lowerMsg.includes("recommend") || lowerMsg.includes("eat") || lowerMsg.includes("food")) {
    const eateries = await Eatery.find({}).limit(3);
    const items = await MenuItem.find({ isAvailable: true }).limit(3);
    
    if (eateries.length > 0) {
      const eateryNames = eateries.map(e => `${e.name} (${e.type})`).join(", ");
      const itemNames = items.map(i => i.name).join(", ");
      response = `Welcome to FoodSpot! I recommend visiting ${eateryNames} today. Some of the most popular dishes trending right now are: ${itemNames}. Would you like to check out their menus?`;
    } else {
      response = "Our nearby food listings are currently being updated. Let me know what cuisine you're craving!";
    }
  } else if (lowerMsg.includes("street") || lowerMsg.includes("chaat") || lowerMsg.includes("local")) {
    const streetFood = await Eatery.find({ type: 'street-food' }).limit(2);
    if (streetFood.length > 0) {
      const names = streetFood.map(e => e.name).join(" and ");
      response = `If you love street food, you must try ${names}! They have legendary local delicacies. You can filter by 'Street Food' on our home page to see all of them!`;
    } else {
      response = "We love local street food! I will look up some famous stalls for you. What type of street food are you in the mood for?";
    }
  } else if (lowerMsg.includes("order") || lowerMsg.includes("track") || lowerMsg.includes("swiggy")) {
    response = "At FoodSpot, you can order directly through our platform, or use our 'Order via Swiggy' redirection link on any restaurant page for fast external delivery!";
  } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
    response = "Hello! Welcome to FoodSpot. I'm your local culinary guide. I can help you discover nearby cafes, premium restaurants, or hidden street-food gems. What are you craving today?";
  } else if (lowerMsg.includes("price") || lowerMsg.includes("budget") || lowerMsg.includes("cheap")) {
    response = "FoodSpot has eateries for all budgets! Use our budget filters: '$' for affordable street-food, '$$' for mid-range cafes, and '$$$' for gourmet dining.";
  } else {
    response = "I'm here to help you discover the best food spots around! You can search by dish name, browse cuisine categories, find street food stalls, or view operating hours. What would you like to explore?";
  }

  res.json({ response });
});

module.exports = { processMessage };
