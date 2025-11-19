// Load environment variables BEFORE any other imports
// Use require() to ensure synchronous execution before ES module imports
const dotenv = require("dotenv");
const { resolve, join } = require("path");
const { existsSync } = require("fs");

// Determine the project root (where package.json is located)
// The script is in scripts/seed.ts, so go up one level to find project root
const scriptDir = __dirname || resolve();
const projectRoot = resolve(scriptDir, "..");

// Load environment variables from .env.local
// Try multiple locations to handle different project structures
const envPaths = [
  join(projectRoot, ".env.local"),  // Project root
  join(process.cwd(), ".env.local"), // Current working directory
  join(process.cwd(), "..", ".env.local"), // One level up
];

// Find and load the first existing .env.local file
let envLoaded = false;
for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded environment variables from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

// Fall back to .env if .env.local not found
if (!envLoaded) {
  const envFallbackPaths = [
    join(projectRoot, ".env"),
    join(process.cwd(), ".env"),
  ];
  
  for (const envPath of envFallbackPaths) {
    if (existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`Loaded environment variables from: ${envPath}`);
      envLoaded = true;
      break;
    }
  }
}

if (!envLoaded) {
  console.warn("Warning: No .env.local or .env file found. Make sure MONGODB_URI is set in your environment.");
}

import connectDB from "../lib/mongodb";
import Product from "../models/Product";
import User from "../models/User";
import Admin from "../models/Admin";
import { hashPassword } from "../lib/middlewares/auth";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected to MongoDB successfully!");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...");
    await Product.deleteMany({});
    await User.deleteMany({});
    await Admin.deleteMany({});
    console.log("Existing data cleared.");

    // Seed Products
    console.log("Seeding products...");
    const products = [
      {
        productName: "Chicken Adobo",
        productDescription: "Traditional Filipino dish with chicken marinated in soy sauce, vinegar, and garlic.",
        productPrice: 12.99,
        productCategory: "South East Asian",
        productImage: ["https://res.cloudinary.com/dplfqp7kf/image/upload/v1/Products/South%20East%20Asian/Chicken%20Adobo/image1"],
        productNote: "Served with steamed rice",
      },
      {
        productName: "Beef Steak",
        productDescription: "Tender beef steak cooked to perfection with herbs and spices.",
        productPrice: 24.99,
        productCategory: "North American",
        productImage: ["https://res.cloudinary.com/dplfqp7kf/image/upload/v1/Products/North%20American/Beef%20Steak/image1"],
        productNote: "Comes with side vegetables",
      },
      {
        productName: "Pork Chop",
        productDescription: "Juicy pork chop with a savory glaze and seasonal vegetables.",
        productPrice: 18.99,
        productCategory: "North American",
        productImage: ["https://res.cloudinary.com/dplfqp7kf/image/upload/v1/Products/North%20American/Pork%20Chop/image1"],
        productNote: "",
      },
      {
        productName: "Tacos",
        productDescription: "Authentic Mexican tacos with your choice of meat, fresh vegetables, and salsa.",
        productPrice: 9.99,
        productCategory: "South American",
        productImage: ["https://res.cloudinary.com/dplfqp7kf/image/upload/v1/Products/South%20American/Tacos/image1"],
        productNote: "Comes with 3 tacos",
      },
      {
        productName: "Sushi Platter",
        productDescription: "Fresh assortment of sushi rolls and nigiri with wasabi and soy sauce.",
        productPrice: 28.99,
        productCategory: "Japanese",
        productImage: ["https://res.cloudinary.com/dplfqp7kf/image/upload/v1/Products/Japanese/Sushi%20Platter/image1"],
        productNote: "12 pieces",
      },
      {
        productName: "Pad Thai",
        productDescription: "Classic Thai stir-fried noodles with shrimp, tofu, and vegetables.",
        productPrice: 14.99,
        productCategory: "South East Asian",
        productImage: ["https://res.cloudinary.com/dplfqp7kf/image/upload/v1/Products/South%20East%20Asian/Pad%20Thai/image1"],
        productNote: "Can be made vegetarian",
      },
      {
        productName: "Chicken Curry",
        productDescription: "Spicy Indian curry with tender chicken pieces in a rich tomato-based sauce.",
        productPrice: 16.99,
        productCategory: "Indian",
        productImage: ["https://res.cloudinary.com/dplfqp7kf/image/upload/v1/Products/Indian/Chicken%20Curry/image1"],
        productNote: "Served with basmati rice and naan",
      },
      {
        productName: "Ramen Bowl",
        productDescription: "Traditional Japanese ramen with rich broth, noodles, and toppings.",
        productPrice: 13.99,
        productCategory: "Japanese",
        productImage: ["https://res.cloudinary.com/dplfqp7kf/image/upload/v1/Products/Japanese/Ramen%20Bowl/image1"],
        productNote: "Vegetarian option available",
      },
    ];

    const insertedProducts = await Product.insertMany(products);
    console.log(`Inserted ${insertedProducts.length} products.`);

    // Seed Users
    console.log("Seeding users...");
    const hashedPassword = await hashPassword("user12345");
    const users = [
      {
        firstName: "John",
        lastName: "Doe",
        userName: "user12345",
        userImage: "https://res.cloudinary.com/dplfqp7kf/image/upload/v1/default-user.jpg",
        email: "user@example.com",
        password: hashedPassword,
        role: "user",
        deliveryAddress: "123 Main Street",
        postalCode: "123456",
        contactNumber: "12345678",
        cart: [],
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        userName: "janesmith",
        userImage: "https://res.cloudinary.com/dplfqp7kf/image/upload/v1/default-user.jpg",
        email: "jane@example.com",
        password: hashedPassword,
        role: "user",
        deliveryAddress: "456 Oak Avenue",
        postalCode: "654321",
        contactNumber: "87654321",
        cart: [],
      },
    ];

    const insertedUsers = await User.insertMany(users);
    console.log(`Inserted ${insertedUsers.length} users.`);

    // Seed Admin
    console.log("Seeding admin...");
    const adminPassword = await hashPassword("admin12345");
    const admin = {
      userName: "admin",
      email: "admin@eatsy.com",
      password: adminPassword,
      role: "admin",
      selectedCarousel: [],
    };

    const insertedAdmin = await Admin.create(admin);
    console.log(`Inserted admin user: ${insertedAdmin.userName}`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\nSummary:");
    console.log(`- Products: ${insertedProducts.length}`);
    console.log(`- Users: ${insertedUsers.length}`);
    console.log(`- Admin: 1`);
    console.log("\nDefault credentials:");
    console.log("User: username=user12345, password=user12345");
    console.log("Admin: username=admin, password=admin12345");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

