import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import "dotenv/config";
import { app } from "./app.js";

const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error("Startup error: MONGODB_URI is missing from the backend .env file.");
    process.exit(1);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("Startup error: PORT must be a valid port number between 1 and 65535.");
    process.exit(1);
}

try {
    await mongoose.connect(mongoUri, { dbName: DB_NAME });
    console.log("MongoDB connected successfully");

    const server = app.listen(port, () => {
        console.log(`App is listening on PORT ${port}`);
    });
    server.on("error", (error) => {
        console.error(`Server failed to listen on PORT ${port}:`, error);
        process.exitCode = 1;
    });
} catch (error) {
    console.error(
        "MongoDB connection failed. Check that the Atlas cluster is running, your current IP is allowed in Network Access, and MONGODB_URI is correct.",
        error
    );
    process.exitCode = 1;
}

export { app };
