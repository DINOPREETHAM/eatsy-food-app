import connectDB from "../../mongodb";
import User from "../../../models/User";

const getOneCart = async (id: any) => {
  try {
    await connectDB();
    const user = await User.findById(id).lean(); // in client side, we have to use absolute URL for the fetch request. when we do this, we are unable to get the session data in the backend. So in this case, req.query.id was used. the user id is attached in the fetch request URL and extracted to be used here.
    if (!user) {
      return {
        body: null,
        message: "Fail to retrieve cart info from user's MongoDB Database",
        status: 404,
      };
    } else {
      console.log("Cart info retrieve from user's MongoDB Database");
      // Serialize to ensure MongoDB _id and other fields are JSON-safe
      return { message: "Cart info retrieve from user's MongoDB Database", body: JSON.parse(JSON.stringify(user)), status: 201 };
    }
  } catch (e: any) {
    return { body: null, message: `Fail to retrieve cart info from user's MongoDB Database. Error message ${e.message}`, status: 400 };
  }
};

export default getOneCart;
