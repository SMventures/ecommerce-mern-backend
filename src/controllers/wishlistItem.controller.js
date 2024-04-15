const wishlistItemService = require("../services/wishlistItem.service.js");

async function updateWishlistItem(req, res) {
    const user = req.user;
    
    console.log("User ID:", user._id); // Add console.log to check user ID

    try {
        const updatedWishlistItem = await wishlistItemService.updateWishlistItem(user._id, req.params.id, req.body);
        
        console.log("Updated Wishlist Item:", updatedWishlistItem); // Add console.log to check updated wishlist item

        return res.status(200).send(updatedWishlistItem);
    } catch (err) {
        console.error("Error updating wishlist item:", err); // Log the error
        return res.status(500).json({ error: err.message });
    }
}

async function removeWishlistItem(req, res) {
    const user = req.user;
    
    console.log("User ID:", user._id); // Add console.log to check user ID

    try {
        console.log("Wishlist Item ID:", req.params.id); // Add console.log to check wishlist item ID

        await wishlistItemService.removeWishlistItem(user._id, req.params.id);

        return res.status(200).send({ message: "item removed", status: true });
    } catch (err) {
        console.error("Error removing wishlist item:", err); // Log the error
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { updateWishlistItem, removeWishlistItem };