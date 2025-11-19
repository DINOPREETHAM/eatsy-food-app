import mongoose, { Schema, Model, Document } from "mongoose";

export interface IProduct extends Document {
  productName: string;
  productDescription: string;
  productPrice: number;
  productCategory: string;
  productImage: string[];
  image?: string;
  productNote: string;
}

const ProductSchema: Schema = new Schema(
  {
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productCategory: { type: String, required: true },
    productImage: { type: [String], required: true },
    image: { type: String },
    productNote: { type: String, default: "" },
  },
  { timestamps: false }
);

// Transform to ensure image field is always available
ProductSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    // Ensure image field exists: prioritize image, fallback to productImage[0]
    if (!ret.image && ret.productImage && Array.isArray(ret.productImage) && ret.productImage.length > 0) {
      ret.image = ret.productImage[0];
    }
    return ret;
  }
});

// Also transform when using .lean() - we'll handle this in helpers
ProductSchema.set('toObject', {
  transform: function(doc: any, ret: any) {
    if (!ret.image && ret.productImage && Array.isArray(ret.productImage) && ret.productImage.length > 0) {
      ret.image = ret.productImage[0];
    }
    return ret;
  }
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

