import connectDB from "../../mongodb";
import User from "../../../models/User";
import { NextApiRequest, NextApiResponse } from "next";

const editCartName = async (req: NextApiRequest, res: NextApiResponse) => {
  const id: any = req.query.id;
  try {
    await connectDB();
    const foundUser = await User.findById(id).lean();
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const objLength = Object.keys(foundUser).length;
    const paidCartNumber = objLength - 11; // number 11 is selected is the number of fields the user have to input when he register. an example, if there are 11 fields for the user to fill up. when he pays, there will be another field which is the 'cart' field. so there are a total of 12 field. 12 - 11 = 1. so when he paids, the cart field will be renamed as paidcart1. if there the user already has a paidcart, when the user pays he will have 13 fields (plus the cart and paidCart1). so it is 13 - 11 = 2 which will give paidcart2. etc.
    
    // Get current cart data
    const currentCart = foundUser.cart || [];
    const purchaseDate = new Date().toLocaleString().split(",")[0];
    
    // Update cart items with purchase date and total price
    const updatedCart = currentCart.map((item: any) => ({
      ...item,
      purchaseDate: purchaseDate,
      cartTotalPrice: req.body,
    }));
    
    // Use $unset to remove cart, then $set to add paidCart
    const updateUserCartName = await User.findByIdAndUpdate(
      id,
      { 
        $unset: { cart: 1 },
        $set: { [`paidCart${paidCartNumber}`]: updatedCart }
      },
      { new: true }
    );
    
    if (updateUserCartName) {
      return res.status(200).json({ message: `Cart name, cart purchase date and cart total price are successfully updated in MongoDB` });
    } else {
      return res.status(400).json({ message: `Fail to update cart name OR fail to insert purchase date OR fail to insert card total price in MongoDB` });
    }
  } catch (e: any) {
    return res.status(e.status || 400).json({ message: "Error occured while transferring cart info to MongoDB.", body: `Error message: ${e.message}` });
  }
};

export default editCartName;
