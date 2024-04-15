const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller.js");

// GET: /api/wishlist
router.get("/", authenticate, wishlistController.findUserWishlist);

// PUT: /api/wishlist/add
// PUT: /api/wishlist/add
router.put("/add", authenticate, wishlistController.addItemToWishlist);


module.exports = router;