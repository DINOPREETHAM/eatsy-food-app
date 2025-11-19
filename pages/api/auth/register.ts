import { uploadRegisterSchema } from "../../../yupSchema/userForm";
import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../lib/middlewares/auth";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      req.body = await uploadRegisterSchema.validate(req.body, {
        // backend validation with yup schema.
        stripUnknown: true,
        strict: true,
        abortEarly: false,
      });
    } catch (error) {
      return res.status(400).json({ message: "Backend validation for user registeration failed.", body: error });
    }
    const { firstName, lastName, userName, userImage, email, password, role, deliveryAddress, postalCode, contactNumber } = req.body;
    try {
      const checkExistingEmail = await User.findOne({ email: email });
      if (checkExistingEmail) {
        return res.status(422).json({ message: "User registeration failed.", body: "Email Already Exists." });
      }
      const checkExistingUserName = await User.findOne({ userName: userName });
      if (checkExistingUserName) {
        return res.status(422).json({ message: "User registeration failed.", body: "Username Already Exists." });
      }
      const newUser = new User({
        firstName,
        lastName,
        userName,
        userImage,
        email,
        password: await hashPassword(password),
        role, // register path is only for user and NOT admin. so role "user" will be inserted in database.
        deliveryAddress,
        postalCode,
        contactNumber,
      });
      await newUser.save();
      return res.status(201).json({ message: "User created.", body: userName });
    } catch (error) {
      return res.status(400).json({ message: "Something when wrong. Fail to register user.", body: error });
    }
  } else {
    res.status(500).json({ message: "Invalid route", body: "Only POST route is accepted" });
  }
};

export default register;
