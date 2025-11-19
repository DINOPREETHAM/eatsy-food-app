import connectDB from "../../mongodb";
import User from "../../../models/User";

const getOneUser = async (id: string) => {
  try {
    await connectDB();
    const user = await User.findById(id).lean();
    // .lean() returns plain JavaScript objects, no need for JSON.parse/stringify
    if (user) {
      console.log(`User '${user.userName}' found in mongoDB`);
      // Serialize to ensure MongoDB _id and other fields are JSON-safe
      return { body: JSON.parse(JSON.stringify(user)), status: 201, message: `User '${user.userName}' found in mongoDB` };
    } else {
      console.log("Fail to retrieve user's database in mongoDB");
      return { body: null, status: 400, message: "Fail to retrieve user's database in mongoDB" };
    }
  } catch (e: any) {
    return { body: null, status: 400, message: `Fail to retrieve user's database in mongoDB, Error Message: ${e.message}` };
  }
};

export default getOneUser;
