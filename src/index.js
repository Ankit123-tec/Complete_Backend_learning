import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import "dotenv/config";

const app = express();

(async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log("MongoDB connected successfully");

        // Start server
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on PORT ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
})();

export { app };
