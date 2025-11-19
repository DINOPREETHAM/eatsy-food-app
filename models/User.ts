import mongoose, { Schema, Model, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  userImage: string;
  email: string;
  password: string;
  role: string;
  deliveryAddress: string;
  postalCode: string;
  contactNumber: number | string;
  cart?: any[];
  paidCart1?: any[];
  paidCart2?: any[];
  paidCart3?: any[];
  [key: string]: any; // For dynamic paidCart fields
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    userImage: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    postalCode: { type: String, required: true },
    contactNumber: { type: Schema.Types.Mixed, required: true },
    cart: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: false, strict: false } // strict: false allows dynamic fields like paidCart1, paidCart2, etc.
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

