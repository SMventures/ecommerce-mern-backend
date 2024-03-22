// productController.js
const productService = require("../services/product.service.js")
const { ObjectId } = require('mongodb');
const Category = require("../models/category.model");

async function createProduct(req, res, next) {
  try {
    console.log("Request body:", req.body);

    // Conditional buffer access (crucial for memory storage)
    let dataURI;
    if (req.file && req.file.buffer) {
      console.log("File information:", req.file); // Log file details
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    } else {
      console.log("No file attached to request.");
      // Handle the case where a file is not uploaded
    }

    const productData = {
      ...req.body,
      size: typeof req.body.size === 'object' ? req.body.size : {} ,
      image: dataURI

    };
    
    const product = await productService.createProduct(productData);
    return res.status(201).json(product);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(400).json({ error: "File not found" });
    } else {
      console.error('Error:', err.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    const productId = req.params.id
    const message = await productService.deleteProduct(productId);
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


async function getSimilarProducts(req, res, next) {
  try {
    const categoryName = req.params.category;
    console.log("getting similar products", categoryName);

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      throw new Error('Category not found');
    }

    const categoryId = category._id;

    const similarProducts = await productService.getSimilarProductsByCategory(categoryId);

    res.json(similarProducts);
  } catch (error) {
    next(error);
  }
}

//  Find a product by ID
async function findProductById(req, res) {
  try {
    const productId = req.params.id;
    const product = await productService.findProductById(productId);
    res.status(200).send(product);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

// Update a product by ID
async function updateProduct(req, res, next) {
  try {
    const productId = req.params.productId
    console.log("req params is this ",productId);

    // Conditional buffer access (crucial for memory storage)
    let dataURI;
    if (req.file && req.file.buffer) {
      console.log("File information:", req.file); // Log file details
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    } else {
      console.log("No file attached to request.");
      // Handle the case where a file is not uploaded
    }
    console.log("this is request body ",req.body);

    const productData = {
      ...req.body,
      size: typeof req.body.size === 'object' ? req.body.size : {} ,
      image: dataURI
    };

    const product = await productService.updateProduct(productId, productData);
    return res.json(product);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(400).json({ error: "File not found" });
    } else {
      console.error('Error:', err.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}


// Get all products
// async function getAllProducts(req, res) {
//   try {
//     const products = await productService.getAllProducts();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }



// Find products by category
async function findProductByCategory(req, res) {
  try {
    const category = req.params.category;
    const products = await productService.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Search products by query
async function searchProduct(req, res) {
  try {

      const query = req.params.query // accessing the 'lavelthree' parameter
      const products = await productService.searchProduct(query);
      console.log(products)
      res.json({
        data: products
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}


// Get all products with filtering and pagination
async function getAllProducts(req, res) {
  try {

    const products = await productService.getAllProducts(req.query);

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
const createMultipleProduct= async (req, res,next) => {

  try {
    
    await productService.createMultipleProduct(req.body)
    console.log("creating multiple products")

    res
      .status(202)
      .json({ message: "Products Created Successfully", success: true });
    } catch (error) {
      console.error("Error creating products:", error);
      res.status(500).json({ error: error.message });
  }
}  

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductByCategory,
  searchProduct,
  createMultipleProduct,
  getSimilarProducts,
  findProductById

};
