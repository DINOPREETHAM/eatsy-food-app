import { getSession } from "next-auth/react";
import connectDB from "../../mongodb";
import User from "../../../models/User";
import { NextApiRequest, NextApiResponse } from "next";

const createCart = async (req: NextApiRequest, res: NextApiResponse) => {
  const session: any = await getSession({ req });
  try {
    await connectDB();
    const userCart = await User.findById(session.id).lean();
    if (!userCart?.cart) {
      // if there is no cart field in the user's data in mongodb, create a new "cart" field to store cart information.
      await User.findByIdAndUpdate(session.id, { $push: { cart: req.body } });
      const user = await User.findById(session.id).lean();
      const transformCart = user?.cart ? (Array.isArray(user.cart[0]) ? user.cart.flat() : user.cart) : []; // req.body inserted into the cart field is a double array [[req.body]]. we need to flatten the array and pass it back to userCart.
      const cartTransformDBResponse = await User.findByIdAndUpdate(session.id, { $set: { cart: transformCart } }, { new: true });
      if (cartTransformDBResponse) {
        return res.status(201).json({ message: "Cart created in user's MongoDB Database" });
      } else {
        return res.status(400).json({
          message: "Create Cart Error.",
          body: `Fail to create cart for username: ${session.user.name} in MongoDB.`,
        });
      }
    } else if (Array.isArray(req.body) && req.body.length === 0) {
      // If cart is empty, remove all information in the user's MongoDB cart field. Leaving an empty cart field.
      const cartToUserDBResponse = await User.findByIdAndUpdate(session.id, { $unset: { cart: 1 } }, { new: true });
      if (cartToUserDBResponse) {
        return res.status(201).json({ message: "Cart removed from user's MongoDB Database" });
      } else {
        return res.status(400).json({
          message: "Remove Cart Error.",
          body: `Fail to remove cart for username: ${session.user.name} in MongoDB.`,
        });
      }
    } else {
      // If cart is not empty and cart field is already created in user's MongoDB data, we will update the cart when the username includes new items into the cart.
      const cartToUserDBResponse = await User.findByIdAndUpdate(session.id, { $set: { cart: req.body } }, { new: true });
      if (cartToUserDBResponse) {
        return res.status(201).json({ message: "Cart updated in user's MongoDB Database" });
      } else {
        return res.status(400).json({
          message: "Update Cart Error.",
          body: `Fail to update cart for username: ${session.user.name} in MongoDB.`,
        });
      }
    }
  } catch (e: any) {
    return res.status(e.status || 400).json({ message: "Error occured while transferring cart info to MongoDB.", body: `Error message: ${e.message}` });
  }
};

export default createCart;
