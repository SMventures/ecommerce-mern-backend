const express=require("express");
const router=express.Router();

const cartService=require("../services/cart.service.js");



const findUserCart = async (req, res) => {
    try {
      const user = req.user;
      const cart = await cartService.findUserCart(user.id);
      res.status(200).json(cart);
    } catch (error) {
      // Handle error here and send appropriate response
      res.status(500).json({ message: "Failed to get user cart.", error: error.message });
    }
}
  

  const addItemToCart = async (req, res) => {
    try {
      const user = req.user;
      await cartService.addCartItem(user._id.toString(), req.body);
     
      res.status(202).json({message:"Item Added To Cart Successfully", status:true});
    } catch (error) {
      // Handle error here and send appropriate response
      res.status(500).json({ message: "Failed to add item to cart.", error: error.message });
    }
  }
  const addMultipleItemsToCart = async (req, res) => {
    try {
      const userId = req.user._id.toString();
      const requests = req.body; // Assuming the request body contains an array of objects with productId and size
  
      // Call the function to add multiple items to the cart
      const itemsAdded = await cartService.addMultipleItemsToCart(userId, requests);
  
      res.status(202).json({ message: "Items Added To Cart Successfully", status: true, itemsAdded });
    } catch (error) {
      // Handle error here and send appropriate response
      res.status(500).json({ message: "Failed to add items to cart.", error: error.message });
    }
  };
  

  module.exports={findUserCart,addItemToCart,addMultipleItemsToCart};