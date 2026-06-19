const mongoose = require('mongoose');

const eaterySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['restaurant', 'cafe', 'street-food'],
      default: 'restaurant'
    },
    description: { type: String, required: true },
    cuisine: [{ type: String }],
    priceRange: { 
      type: String, 
      required: true, 
      enum: ['$', '$$', '$$$'], 
      default: '$$' 
    },
    costForTwo: { type: Number, default: 200 },
    rating: { type: Number, default: 4.0, min: 1, max: 5 },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    operatingHours: { type: String, default: '9:00 AM - 10:00 PM' },
    imageUrl: { type: String, default: '' },
    popularDishes: [{ type: String }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

const Eatery = mongoose.model('Eatery', eaterySchema);

module.exports = Eatery;
