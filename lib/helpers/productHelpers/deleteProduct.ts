import connectDB from "../../mongodb";
import Product from "../../../models/Product";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteImageFolder, deleteImages } from "../../../cloudinary/imageSupport";

const deleteProduct = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    await deleteImages(request.body.productImage);
    await deleteImageFolder("Products", request.body.productCategory, request.body.productName);
    await connectDB();
    const deleteProductResponse = await Product.findByIdAndDelete(request.body._id);
    if (deleteProductResponse) {
      console.log("Product has been deleted from mongodb database");
      return response.status(201).json({ message: "Product deleted in Mongo and Cloudinary DB" });
    } else {
      return response.status(400).json({
        message: "Fail to find product and delete in MongoDB",
        body: "Product was NOT deleted from Mongo DB database.",
      });
    }
  } catch (e: any) {
    return response.status(e.status || 400).json({ message: "Error occured while deleting product.", body: `Error message: ${e.message}` });
  }
};

export default deleteProduct;
