const Wishlist = require("../models/wishlist.model.js");
const WishlistItem = require("../models/wishlistItem.model.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");

// Create a new wishlist for a user
async function createWishlist(user) {
  const wishlist = new Wishlist({ user });
  const createdWishlist = await wishlist.save();
  return createdWishlist;
}

// Find a user's wishlist and update wishlist details
async function findUserWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  
  let wishlistItems = await WishlistItem.find({ wishlist: wishlist._id }).populate("product");

  wishlist.wishlistItems = wishlistItems;

  return wishlist;
}

// Add an item to the user's wishlist
async function addWishlistItem(userId, req) {
  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // If no wishlist is found, create a new wishlist for the user
      const createdWishlist = await createWishlist(userId);
      wishlist = createdWishlist;
    }

    const product = await Product.findById(req.productId);

    const isPresent = await WishlistItem.findOne({ wishlist: wishlist._id, product: product._id, userId });
  
    if (!isPresent) {
      const wishlistItem = new WishlistItem({
        product: product._id,
        wishlist: wishlist._id,
        userId,
        size: req.size,
        price: product.discountedPrice,
        discountedPrice: product.discountedPrice
      });

      const createdWishlistItem = await wishlistItem.save();
      wishlist.wishlistItems.push(createdWishlistItem);
      await wishlist.save();
    }

    return 'Item added to wishlist';
  } catch (error) {
    throw new Error("Error adding item to wishlist: " + error.message);
  }
}


module.exports = { createWishlist, findUserWishlist, addWishlistItem };