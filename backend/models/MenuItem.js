const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    eatery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Eatery',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
