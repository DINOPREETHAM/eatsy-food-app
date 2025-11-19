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

const getAllProduct = async () => {
  try {
    await connectDB();
    const products = await Product.find({}).lean();
    // .lean() returns plain JavaScript objects, no need for JSON.parse/stringify
    const allProducts = products ?? [];
    // Normalize image field for all products
    const normalizedProducts = allProducts.map(normalizeProductImage);
    if (normalizedProducts.length > 0) {
      console.log("All products from mongodb database found");
      // Serialize to ensure MongoDB _id and other fields are JSON-safe
      return { body: JSON.parse(JSON.stringify(normalizedProducts)), message: "All products from mongodb database found", status: 201 };
    } else {
      console.log("Fail to get all product details from get request");
      return { body: [], message: "Fail to get all product details from get request", status: 400 };
    }
  } catch (e: any) {
    console.log("Error occurred while retrieving all products info.", `Error message: ${e.message}`);
    return { body: [], message: `Error occurred while retrieving all products info. Error message: ${e.message}`, status: 400 };
  }
};

export default getAllProduct;
