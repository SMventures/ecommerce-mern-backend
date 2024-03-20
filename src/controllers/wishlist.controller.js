const express = require("express");
const router = express.Router();

const wishlistService = require("../services/wishlist.service.js");

const findUserWishlist = async (req, res) => {
  console.log("Starting wishlist")
  try {
    const user = req.user;
    console.log("User ID:", user.id); // Add console.log to check user ID
    const wishlist = await wishlistService.findUserWishlist(user.id);
    console.log("Wishlist:", wishlist); // Add console.log to check wishlist
    res.status(200).json(wishlist);
  } catch (error) {
    // Handle error here and send appropriate response
    console.error("Error finding user wishlist:", error); // Log the error
    res.status(500).json({ message: "Failed to get user wishlist.", error: error.message });
  }
};

const addItemToWishlist = async (req, res) => {
 
  try {
    const user = req.user;
    console.log("User ID:", user._id.toString()); // Add console.log to check user ID
    console.log("Request body:", req.body); // Add console.log to check request body
    await wishlistService.addWishlistItem(user._id.toString(), req.body);
    res.status(202).json({ message: "Item Added To Wishlist Successfully", status: true });
  } catch (error) {
    // Handle error here and send appropriate response
    console.error("Error adding item to wishlist:", error); // Log the error
    res.status(500).json({ message: "Failed to add item to wishlist.", error: error.message });
  }
};

module.exports = { findUserWishlist, addItemToWishlist };
