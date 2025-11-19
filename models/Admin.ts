import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAdmin extends Document {
  userName: string;
  email: string;
  password: string;
  role: string;
  selectedCarousel?: any[];
}

const AdminSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "admin" },
    selectedCarousel: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: false, collection: "admin" } // Explicitly set collection name to "admin" (singular)
);

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;

