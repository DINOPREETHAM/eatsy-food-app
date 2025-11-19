import { uploadProductSchema } from "../../../yupSchema/productForm";
import connectDB from "../../mongodb";
import Product from "../../../models/Product";
import { NextApiRequest, NextApiResponse } from "next";
import { uploadImages } from "../../../cloudinary/imageSupport";

const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    req.body = await uploadProductSchema.validate(req.body, {
      // backend validation with yup schema.
      stripUnknown: true,
      strict: true,
      abortEarly: false,
    });
  } catch (error: any) {
    return res.status(400).json({ message: `Backend ${error.name} when creating product`, body: error.message });
  }
  let { productName, productCategory, productDescription, productImage, productPrice } = req.body;
  try {
    await connectDB();
    const checkExistingProduct = await Product.findOne({ productName: productName });
    if (checkExistingProduct) {
      return res.status(422).json({ message: "Create product error", body: "Product Already Exists in MongoDB." });
    }
    const imageCloudinaryArray = await uploadImages(productImage, productName, productCategory);
    productImage = imageCloudinaryArray;
    const newProduct = new Product({
      productName,
      productCategory,
      productDescription,
      productPrice,
      productImage,
      productNote: "",
    });
    const savedProduct = await newProduct.save();
    return res.status(201).json({ message: "Product created in Cloudinary and Mongodb Database", newProductId: savedProduct._id.toString() });
  } catch (e: any) {
    return res.status(e.status || 400).json({ message: "Error occured while creating product.", body: `Error message: ${e.message}` });
  }
};

export default createProduct;
