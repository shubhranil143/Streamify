import mongoose from "mongoose";

// Establish singleton connection to MongoDB with connection pooling
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1); // Exit with failure (1) if database connection fails, preventing the app from running in a broken state
    }
};