const WishlistItem = require("../models/wishlistItem.model.js");
const userService = require("../services/user.service.js");

// Create a new wishlist item
async function createWishlistItem(wishlistItemData) {
  try {
    const wishlistItem = new WishlistItem(wishlistItemData);
    const createdWishlistItem = await wishlistItem.save();
    return createdWishlistItem;
  } catch (error) {
    throw new Error("Error creating wishlist item: " + error.message);
  }
}

// Update an existing wishlist item
async function updateWishlistItem(userId, wishlistItemId, wishlistItemData) {
  try {
    const item = await findWishlistItemById(wishlistItemId);
    const user = await userService.findUserById(item.userId);

    if (!user || user.id !== userId) {
      throw new Error("You can't update another user's wishlist item");
    }

    item.size = wishlistItemData.size;
    const updatedWishlistItem = await item.save();
    return updatedWishlistItem;
  } catch (error) {
    throw new Error("Error updating wishlist item: " + error.message);
  }
}

// Check if a wishlist item already exists in the user's wishlist
async function isWishlistItemExist(wishlist, product, size, userId) {
  const wishlistItem = await WishlistItem.findOne({ wishlist, product, size, userId });
  return wishlistItem;
}

// Remove a wishlist item
async function removeWishlistItem(userId, wishlistItemId) {
  try {
    const item = await findWishlistItemById(wishlistItemId);
    const user = await userService.findUserById(item.userId);

    if (!user || user.id !== userId) {
      throw new Error("You can't remove another user's wishlist item");
    }

    await WishlistItem.findByIdAndDelete(wishlistItemId);
  } catch (error) {
    throw new Error("Error removing wishlist item: " + error.message);
  }
}

// Find a wishlist item by its ID
async function findWishlistItemById(wishlistItemId) {
  const wishlistItem = await WishlistItem.findById(wishlistItemId);
  if (wishlistItem) {
    return wishlistItem;
  } else {
    throw new Error(`Wishlist item not found with id: ${wishlistItemId}`);
  }
}

module.exports = {
  createWishlistItem,
  updateWishlistItem,
  isWishlistItemExist,
  removeWishlistItem,
  findWishlistItemById,
};
