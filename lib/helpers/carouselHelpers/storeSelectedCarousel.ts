import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../mongodb";
import Admin from "../../../models/Admin";

const storeSelectedCarousel = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id: any = req.query.id;
    await connectDB();
    const updateAdminWithCarousel = await Admin.findByIdAndUpdate(id, { $set: { selectedCarousel: req.body } }, { new: true });
    if (updateAdminWithCarousel) {
      console.log(`Selected carousels stored in adminstrator's database in MongoDB`);
      return res.status(201).json({ message: "Selected carousels stored in adminstrator's database in MongoDB" });
    } else {
      return res.status(400).json({ message: "Fail to store carousels in adminstrator's database in MongoDB" });
    }
  } catch (e: any) {
    return res.status(e.status || 400).json({ message: "Error occured while storing carousel.", body: `Error message: ${e.message}` });
  }
};

export default storeSelectedCarousel;
