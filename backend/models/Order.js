const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    eatery: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Eatery'
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'MenuItem',
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
