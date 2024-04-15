const express = require("express");
const authenticate = require("../middleware/authenticat.js");
const router = express.Router();
const wishlistItemController = require("../controllers/wishlistItem.controller.js");

router.put("/:id", authenticate, wishlistItemController.updateWishlistItem);
router.delete("/:id", authenticate, wishlistItemController.removeWishlistItem);

module.exports = router;