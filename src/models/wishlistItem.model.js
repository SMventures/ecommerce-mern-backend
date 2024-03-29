const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'wishlist',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  size: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
});

const WishlistItem = mongoose.model('wishlistItems', wishlistItemSchema);

module.exports = WishlistItem;
