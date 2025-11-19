// DEPRECATED: This file is kept for backward compatibility but should not be used.
// All new code should use connectDB() from ../mongodb.ts and mongoose models directly.
// This wrapper will be removed in a future version.

import connectDB from "../mongodb";
import mongoose from "mongoose";

/**
 * @deprecated Use connectDB() from ../mongodb.ts and mongoose models instead
 */
export const connectToDatabase = async () => {
  try {
    await connectDB();
    // Return mongoose connection's native db for backward compatibility
    return {
      db: () => mongoose.connection.db,
      close: () => {
        // Mongoose connection is managed globally, no need to close
        console.warn("connectToDatabase().close() is deprecated. Mongoose connection is managed globally.");
      },
    };
  } catch (error: any) {
    throw Error(`Fail to connect to MongoDB. Check client connection again: ${error.message}`);
  }
};
