const CartItem = require("../models/cartItem.model.js");
const userService = require("../services/user.service.js");

// Create a new cart item
async function createCartItem(cartItemData) {
  const cartItem = new CartItem(cartItemData);
  cartItem.quantity = 1;
  cartItem.price = cartItem.product.price * cartItem.quantity;
  cartItem.discountedPrice = cartItem.product.discountedPrice * cartItem.quantity;

  const createdCartItem = await cartItem.save();
  return createdCartItem;
}

// Update an existing cart item
async function updateCartItem(userId, cartItemId, cartItemData) {
  const item = await findCartItemById(cartItemId);

  if (!item) {
    throw new Error(`Cart item not found: ${cartItemId}`);
  }

  const user = await userService.findUserById(item.userId);

  if (!user) {
    throw new Error(`User not found: ${item.userId}`);
  }

  if (user.id === userId.toString()) {
    item.quantity = cartItemData.quantity;
    item.price = item.quantity * item.product.price;
    item.discountedPrice = item.quantity * item.product.discountedPrice;

    const updatedCartItem = await item.save();
    return updatedCartItem;
  } else {
    throw new Error("You can't update another user's cart item");
  }
}

// Check if a cart item already exists in the user's cart
async function isCartItemExist(cart, product, size, userId) {
  const cartItem = await CartItem.findOne({ cart, product, size, userId });
  return cartItem;
}

// Remove a cart item
async function removeCartItem(userId, cartItemId) {
  const cartItem = await CartItem.findById(cartItemId);
  const user = await userService.findUserById(userId);

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  if (cartItem && user.id === cartItem.userId.toString()) {
    await CartItem.findByIdAndDelete(cartItemId);
  } else {
    throw new Error("You can't remove another user's cart item");
  }
}

// Find a cart item by its ID
async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId).populate("product");
  if (cartItem) {
    return cartItem;
  } else {
    throw new Error(`CartItem not found with id: ${cartItemId}`);
  }
}

module.exports = {
  createCartItem,
  updateCartItem,
  isCartItemExist,
  removeCartItem,
  findCartItemById,
};
