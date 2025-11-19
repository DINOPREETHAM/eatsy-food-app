/**
 * Normalizes product image URLs:
 * - Handles array/string productImage
 * - Encodes spaces to %20
 * - Adds .jpg extension if missing
 * - Provides fallback
 */
export const normalizeImageUrl = (product: any): string => {
  // Get image URL from various possible fields
  let imageUrl: string | undefined;
  
  if (Array.isArray(product.productImage) && product.productImage.length > 0) {
    imageUrl = product.productImage[0];
  } else if (typeof product.productImage === 'string' && product.productImage) {
    imageUrl = product.productImage;
  } else if (product.image) {
    imageUrl = product.image;
  } else if (product.productImages?.[0]) {
    imageUrl = product.productImages[0];
  } else if (product.productImg?.[0]) {
    imageUrl = product.productImg[0];
  }

  // If no URL found, return fallback
  if (!imageUrl || typeof imageUrl !== 'string') {
    return "/no-image.png";
  }

  // Encode spaces to %20
  let normalized = imageUrl.replace(/ /g, '%20');

  // If it's a Cloudinary URL and doesn't have an extension, add .jpg
  if (normalized.includes('res.cloudinary.com')) {
    // Check if URL ends with a file extension
    const hasExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(normalized);
    if (!hasExtension) {
      // Remove trailing slash if present, then add .jpg
      normalized = normalized.replace(/\/$/, '') + '.jpg';
    }
  }

  return normalized;
};

