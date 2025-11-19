import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../mongodb";
import Product from "../../../models/Product";
import { normalizeImageUrl } from "../../utils/imageUrlNormalizer";

// Helper function to normalize image field
const normalizeProductImage = (product: any): any => {
  if (!product) return product;
  // Normalize image URL (handles encoding, extensions, etc.)
  const image = normalizeImageUrl(product);
  return {
    ...product,
    image: image,
    // Ensure productImage is always an array for consistency
    productImage: Array.isArray(product.productImage) ? product.productImage : (product.productImage ? [product.productImage] : []),
  };
};

const getOneProduct = async (id: string) => {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    // .lean() returns plain JavaScript objects, no need for JSON.parse/stringify
    if (product) {
      // Normalize image field
      const normalizedProduct = normalizeProductImage(product);
      console.log(`Product '${normalizedProduct.productName}' located in Mongo database`);
      // Serialize to ensure MongoDB _id and other fields are JSON-safe
      return { message: `Product '${normalizedProduct.productName}' located in Mongo database`, body: JSON.parse(JSON.stringify(normalizedProduct)), status: 201 };
    } else {
      return {
        body: null,
        message: "Fail to locate individual product details in MongoDB",
        status: 404,
      };
    }
  } catch (e: any) {
    return {
      body: null,
      message: `Error occurred while retrieving individual product details. Error message: ${e.message}`,
      status: 400,
    };
  }
};

export default getOneProduct;
