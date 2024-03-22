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
    // Log the input parameters for debugging
    console.log("userId:", userId);
    console.log("wishlistItemId:", wishlistItemId);
    console.log("wishlistItemData:", wishlistItemData);

    // Find the wishlist item by ID
    const item = await findWishlistItemById(wishlistItemId);

    // Log the retrieved wishlist item for debugging
    console.log("Retrieved Wishlist Item:", item);

    if (!item) {
      throw new Error("wishlist item not found: " + wishlistItemId);
    }

    // Find the user associated with the wishlist item
    const user = await userService.findUserById(item.userId);

    // Log the retrieved user for debugging
    console.log("Retrieved User:", user);

    if (!user) {
      throw new Error("user not found: " + userId);
    }

    if (user.id === userId.toString()) {
      // Update the size of the wishlist item
      item.size = wishlistItemData.size;

      // Save the updated wishlist item
      const updatedWishlistItem = await item.save();

      // Log the updated wishlist item for debugging
      console.log("Updated Wishlist Item:", updatedWishlistItem);

      // Return the updated wishlist item
      return updatedWishlistItem;
    } else {
      throw new Error("You can't update another user's wishlist_item");
    }
  } catch (error) {
    // Log any errors for debugging
    console.error("Error updating wishlist item:", error.message);
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
    console.log(user.id == userId);

    if (user.id != userId) {
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
