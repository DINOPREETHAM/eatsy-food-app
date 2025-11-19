# MongoDB Setup Guide

This document outlines the MongoDB connection setup for the Eatsy Food App.

## Environment Variables

Create a `.env.local` file in the root directory (`EatsyAppNextJs-main/`) with the following content:

```
MONGODB_URI="mongodb+srv://Dinopreetham:megacharizard@class.l1yju44.mongodb.net/EatsyApp?retryWrites=true&w=majority"
```

## Database Connection

The application now uses Mongoose for database connections. The connection is established through:

- **Connection File**: `lib/mongodb.ts`
- **Function**: `connectDB()` - A standard Mongoose connection function with connection caching

## Collections

The application uses the following MongoDB collections:

1. **products** - Stores product information
   - Fields: productName, productDescription, productPrice, productCategory, productImage, productNote

2. **users** - Stores user information
   - Fields: firstName, lastName, userName, userImage, email, password, role, deliveryAddress, postalCode, contactNumber, cart, paidCart1, paidCart2, etc.

3. **admin** - Stores administrator information
   - Fields: userName, email, password, role, selectedCarousel

## Models

Mongoose models are defined in the `models/` directory:

- `models/Product.ts` - Product model
- `models/User.ts` - User model
- `models/Admin.ts` - Admin model

## Seeding the Database

To seed the database with sample data, run:

```bash
npm run seed
```

This will:
- Clear existing data (optional - can be commented out in the script)
- Insert sample products
- Insert sample users
- Insert an admin user

Default credentials after seeding:
- **User**: username=`user12345`, password=`user12345`
- **Admin**: username=`admin`, password=`admin12345`

## API Routes

All API routes have been updated to call `connectDB()` at the top:

- `pages/api/products/index.ts`
- `pages/api/products/edit/[id].ts`
- `pages/api/auth/register.ts`
- `pages/api/auth/[...nextauth].ts`
- `pages/api/cartStorage/[id].ts`
- `pages/api/carousel/[id].ts`

## Notes

- The connection uses connection caching to prevent multiple connections in development
- The existing `connectToDatabase()` function in `lib/middlewares/mongodb.ts` has been updated to use the new Mongoose connection internally
- All helper files continue to work with the existing `connectToDatabase()` function for backward compatibility

