import connectDB from "../../mongodb";
import Admin from "../../../models/Admin";
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

const getSelectedCarousel = async () => {
  const adminId = "61f05a68e26e1cbc5fcbe23a";
  try {
    await connectDB();
    const foundAdminUser = await Admin.findById(adminId).lean();
    if (foundAdminUser && foundAdminUser.selectedCarousel) {
      console.log("Selected carousels stored in adminstrator's database in MongoDB");
      const carousels = Array.isArray(foundAdminUser.selectedCarousel) ? foundAdminUser.selectedCarousel : [];
      // Normalize image field for all carousel products
      const normalizedCarousels = carousels.map(normalizeProductImage);
      // Serialize to ensure MongoDB _id and other fields are JSON-safe
      return JSON.parse(JSON.stringify(normalizedCarousels));
    } else {
      // Silently return empty array if admin not found (no error logging)
      return [];
    }
  } catch (e: any) {
    // Silently return empty array on error (no error logging to prevent console spam)
    return [];
  }
};

export default getSelectedCarousel;
