const Category = require("../models/category.model");
const Product = require("../models/product.model");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { ObjectId } = require('mongodb');



async function createProduct(reqData) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  try {
    console.log( process.env.CLOUDINARY_CLOUD_NAME)
    console.log("Request Data:", reqData)
      // Upload images to Cloudinary
      // const imageLink = [];
    

      // for (let i = 0; i < reqData.imageFiles.length; i++) {
      //     const result = await cloudinary.uploader.upload(reqData.imageFiles[i], {
      //         folder: "products",
      //     });

      
      const result  = await cloudinary.uploader.upload(reqData.image, {
                folder: "products",
            });
      const imageLink = {
                public_id: result.public_id,
                url: result.secure_url,
            }
          
    //   imageLink.push({
    //     public_id: result.public_id,
    //     url: result.secure_url,
    // });
  
      console.log("Images Uploaded:", imageLink);

      let topLevel = await Category.findOne({ name: reqData.topLavelCategory });

      if (!topLevel) {
          const topLavelCategory = new Category({
              name: reqData.topLavelCategory,
              level: 1,
          });

          topLevel = await topLavelCategory.save();
      }

      let secondLevel = await Category.findOne({
          name: reqData.secondLavelCategory,
          parentCategory: topLevel._id,
      });

      if (!secondLevel) {
          const secondLavelCategory = new Category({
              name: reqData.secondLavelCategory,
              parentCategory: topLevel._id,
              level: 2,
          });

          secondLevel = await secondLavelCategory.save();
      }

      let thirdLevel = await Category.findOne({
          name: reqData.thirdLavelCategory,
          parentCategory: secondLevel._id,
      });

      if (!thirdLevel) {
          const thirdLavelCategory = new Category({
              name: reqData.thirdLavelCategory,
              parentCategory: secondLevel._id,
              level: 3,
          });

          thirdLevel = await thirdLavelCategory.save();
      }

      const product = new Product({
          title: reqData.title,
          color: reqData.color,
          description: reqData.description,
          highlights: reqData.highlights,
          specifications: reqData.specifications,
          discountedPrice: reqData.discountedPrice,
          discountPersent: reqData.discountPersent,
          imageUrl: imageLink.url, // Store image URLs in the database
          brand: reqData.brand,
          price: reqData.price,
          sizes: reqData.size,
          quantity: reqData.quantity,
          category: thirdLevel._id,
      });

      const savedProduct = await product.save();

      return savedProduct;

  } catch (error) {
      // Handle errors appropriately
      console.error("Error creating product:", error);
      throw error; // rethrow the error for the caller to handle
  }
}

// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("Product not found with id: " + productId);
  }

  // Delete product images from Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  // Delete product from the database
  await Product.findByIdAndDelete(productId);

  return "Product deleted successfully";
}


async function updateProduct(productId, reqData) {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (reqData.images !== undefined) {
      let imagesLink = [];

      // Delete existing images from Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
      }

      // Upload new images to Cloudinary
      if (Array.isArray(reqData.images)) {
        for (let i = 0; i < reqData.images.length; i++) {
          const result = await cloudinary.uploader.upload(reqData.images[i], {
            folder: "products",
          });

          imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      } else if (typeof reqData.images === "string") {
        const result = await cloudinary.uploader.upload(reqData.images, {
          folder: "products",
        });

        imagesLink.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      reqData.images = imagesLink;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, { new: true });

    return updatedProduct;
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }
}

// Find a product by ID
async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;
  (pageSize = pageSize || 10), (pageNumber = pageNumber || 1);
  let query = Product.find().populate("category");


  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory)
      query = query.where("category").equals(existCategory._id);
    else return { content: [], currentPage: 1, totalPages:1 };
  }

  if (color) {
    const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
    const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    query = query.where("color").regex(colorRegex);
    // query = query.where("color").in([...colorSet]);
  }

  if (sizes) {
    const sizesSet = new Set(sizes);
    
    query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Apply pagination
  const totalProducts = await Product.countDocuments(query);

  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);


  return { content: products, currentPage: pageNumber, totalPages:totalPages };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}
async function getSimilarProductsByCategory(category) {
  try {
    console.log('Fetching similar products for category:', category);

    const objectId = new ObjectId(category); // Convert the category parameter to an ObjectId
    const similarProduct = await Product.findOne({ category: objectId });

    if (!similarProduct) {
      console.log('No similar product found for the given category');
      throw new Error('No similar product found for the given category');
    }

    console.log('Similar product found:', similarProduct);

    const similarProducts = await Product.find({
      category: objectId,
      _id: { $ne: similarProduct._id },
    });

    console.log('Similar products:', similarProducts);

    return similarProducts;
  } catch (error) {
    console.error('Error fetching similar products:', error);
    throw new Error('Error fetching similar products');
  }
}




async function searchProduct(query) {
  try {
      // Search products by title or description
      const products = await Product.find({
          $or: [
              { title: { $regex: new RegExp('^' + query, 'i') } }, // Search by title
              { description: { $regex: new RegExp(query, 'i') } }   // Search by description
          ]
      });

      if (products.length === 0) {
          return [{ message: 'No results found' }];
      }

      return products;
  } catch (error) {
      console.log(error);
      throw new Error('Error searching products');
  }
}




module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
  searchProduct,
  getSimilarProductsByCategory
};
