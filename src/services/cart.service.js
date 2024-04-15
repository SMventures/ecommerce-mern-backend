const Cart = require("../models/cart.model.js");
const CartItem = require("../models/cartItem.model.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");


// Create a new cart for a user
async function createCart(user) {
  const cart = new Cart({ user });
  const createdCart = await cart.save();
  return createdCart;
}

// Find a user's cart and update cart details
async function findUserCart(userId) {
  let cart =await Cart.findOne({ user: userId })
  
  let cartItems=await CartItem.find({cart:cart._id}).populate("product")

  cart.cartItems=cartItems
  

  let totalPrice = 0;
  let totalDiscountedPrice = 0;
  let totalItem = 0;

  for (const cartItem of cart.cartItems) {
    totalPrice += cartItem.price;
    totalDiscountedPrice += cartItem.discountedPrice;
    totalItem += cartItem.quantity;
  }

  cart.totalPrice = totalPrice;
  cart.totalItem = totalItem;
  cart.totalDiscountedPrice = totalDiscountedPrice;
  cart.discounte = totalPrice - totalDiscountedPrice;

  // const updatedCart = await cart.save();
  return cart;
}

// Add an item to the user's cart
async function addCartItem(userId, req) {
 
  const cart = await Cart.findOne({ user: userId });
  const product = await Product.findById(req.productId);

  const isPresent = await CartItem.findOne({ cart: cart._id, product: product._id, userId });
  

  if (!isPresent) {
    const cartItem = new CartItem({
      product: product._id,
      cart: cart._id,
      quantity: 1,
      userId,
      price: product.discountedPrice,
      size: req.size,
      discountedPrice:product.discountedPrice
    });

   

    const createdCartItem = await cartItem.save();
    cart.cartItems.push(createdCartItem);
    await cart.save();
  }

  return 'Item added to cart';
}
// const addMultipleItemsToCart = async (userId, productIds) => {
//   const cart = await Cart.findOne({ user: userId });
//   let numItemsAdded = 0;

//   if (!productIds || !productIds.length) {
//     return { message: "No products to add to cart", status: false };
//   }

//   for (const productId of productIds) {
//     const product = await Product.findById(productId);
//     if (!product) {
//       continue;
//     }

//     const isPresent = await CartItem.findOne({ cart: cart._id, product: product._id, userId });

//     if (!isPresent) {
//       const cartItem = new CartItem({
//         product: product._id,
//         cart: cart._id,
//         quantity: 1,
//         userId,
//         price: product.discountedPrice,
//         size: 'default', // Assuming default size for now
//         discountedPrice: product.discountedPrice
//       });

//       const createdCartItem = await cartItem.save();
//       cart.cartItems.push(createdCartItem);
//       await cart.save();
//       numItemsAdded++;
//     }
//   }

//   const message = numItemsAdded > 0 ? "Items Added To Cart Successfully" : "No products added to cart";
//   const status = numItemsAdded > 0;
//   const updatedCart = await Cart.findById(cart._id).populate('cartItems.product');

//   return { message, status, updatedCart };
// };
// Assuming you have a Cart model imported or defined somewhere

async function addMultipleItemsToCart(userId, req) {
  const cart = await Cart.findOne({ user: userId });
  const productIds = req.productIds; // Assuming req contains an array of product IDs
  const itemsAdded = [];

  // Loop through each productId in the array
  for (const productId of productIds) {
    const product = await Product.findById(productId);
    const isPresent = await CartItem.findOne({ cart: cart._id, product: product._id, userId });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        userId,
        price: product.discountedPrice,
        size: req.size, // Assuming size is provided in req
        discountedPrice: product.discountedPrice
      });

      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);
      await cart.save();

      itemsAdded.push(createdCartItem); // Push the added item to the itemsAdded array
    }
  }

  return itemsAdded;
}






module.exports = { createCart, findUserCart, addCartItem,addMultipleItemsToCart};