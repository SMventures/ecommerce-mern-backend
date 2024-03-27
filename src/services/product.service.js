const Category = require("../models/category.model");
const Product = require("../models/product.model");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { ObjectId } = require('mongodb');

const mongoose = require('mongoose');


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
  console.log("deletetdtvygvg",product.images);

  if (!product) {
    throw new Error("Product not found with id: " + productId);
  }


  // Delete product images from Cloudinary
  if(product.images){
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }}

  // Delete product from the database
  await Product.findByIdAndDelete(productId);

  return "Product deleted successfully";
}


// async function updateProduct(productId, reqData) {
//   try {
//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET
//     });

//     console.log("Updating product with ID:", productId); // Log productId
//     console.log("Request data:", reqData); // Log reqData
//     // Ensure productId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       throw new Error("Invalid productId");
//     }


//     const product = await Product.findById(productId);
//     console.log(`this is the product fetch with id: ${productId} ok then product is this `,product);

//     if (!product) {
//       console.error('Product not found for ID:', productId); // Log productId if product not found
//       throw new Error('Product not found');
//     }

//     if (reqData.images !== undefined) {
//       let imagesLink = [];

//       // Delete existing images from Cloudinary
//       for (let i = 0; i < product.images.length; i++) {
//         await cloudinary.uploader.destroy(product.images[i].public_id);
//       }

//       // Upload new images to Cloudinary
//       if (Array.isArray(reqData.images)) {
//         for (let i = 0; i < reqData.images.length; i++) {
//           const result = await cloudinary.uploader.upload(reqData.images[i], {
//             folder: "products",
//           });

//           imagesLink.push({
//             public_id: result.public_id,
//             url: result.secure_url,
//           });
//         }
//       } else if (typeof reqData.images === "string") {
//         const result = await cloudinary.uploader.upload(reqData.images, {
//           folder: "products",
//         });

//         imagesLink.push({
//           public_id: result.public_id,
//           url: result.secure_url,
//         });
//       }

//       reqData.images = imagesLink;
//     }
//     console.log("this is the data with whcih we are updating it",reqData);
//     const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, { new: true });
//     const updatedProductdescription= await Product.findById(productId);
//     console.log("this is the update product ",updatedProductdescription)

//     return updatedProduct; // Return the updated product
//   } catch (error) {
//     console.error(`Error updating product: ${error.message}`);
//     throw new Error(`Error updating product: ${error.message}`);
//   }
// }
async function updateProduct(productId, reqData) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log("Updating product with ID:", productId); // Log productId
    console.log("Request data:", reqData); // Log reqData
    // Ensure productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid productId");
    }

    const product = await Product.findById(productId);
    console.log(`Product fetched with id: ${productId}`, product);

    if (!product) {
      console.error('Product not found for ID:', productId);
      throw new Error('Product not found');
    }

    // Check if imageFile is provided
    if (reqData.imageFile) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(reqData.imageFile.path, {
        folder: "products",
      });

      // Store image URL in reqData
      reqData.imageUrl = result.secure_url;

      // Delete existing images from Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
      }
    }

    // Update the product with reqData
    const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, { new: true });
    console.log("Updated product:", updatedProduct);

    return updatedProduct; // Return the updated product
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
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

  console.log(category);

  // Set default values for pageSize and pageNumber
  pageSize = pageSize || 10;
  pageNumber = pageNumber || 1;

  let query = Product.find().populate("category");

  // Filter by category if provided
  if (category) {
    const existCategory = await Category.findOne({ name: category });
    console.log(existCategory)
    if (existCategory) {
      query = query.where("category").equals(existCategory._id);
S    } else {
      return { content: [], currentPage: 1, totalPages: 1 };
    }
  }

  // Apply color filter
  if (color) {
    const colorSet = new Set(color.split(",").map(c => c.trim().toLowerCase()));
    const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    query = query.where("color").regex(colorRegex);
  }

  // Apply size filter
  if (sizes) {
    const sizesSet = new Set(sizes);
    query = query.where("sizes.name").in([...sizesSet]);
  }

  // Apply price range filter
  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  // Apply minimum discount filter
  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  // Apply stock availability filter
  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  // Apply sorting
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
  console.log("these are the products fetchedddd by category param",products)

  return { content: products, currentPage: pageNumber, totalPages };
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
