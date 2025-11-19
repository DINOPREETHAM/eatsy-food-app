import connectDB from "../../mongodb";
import User from "../../../models/User";

const getAllUsers = async () => {
  try {
    await connectDB();
    const users = await User.find({}).lean();
    // .lean() returns plain JavaScript objects, no need for JSON.parse/stringify
    const allUsers = users ?? [];
    if (allUsers.length > 0) {
      console.log("All users found in mongoDB");
      // Serialize to ensure MongoDB _id and other fields are JSON-safe
      return { body: JSON.parse(JSON.stringify(allUsers)), status: 201, message: "All users found in mongoDB" };
    } else {
      console.log("Fail to retrieve users database in mongoDB");
      return { body: [], status: 400, message: "Fail to retrieve users database in mongoDB" };
    }
  } catch (e: any) {
    return { body: [], status: 400, message: `Fail to retrieve users database in mongoDB, Error Message: ${e.message}` };
  }
};

export default getAllUsers;
