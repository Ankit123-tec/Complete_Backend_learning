import "dotenv/config";
import express from "express"
import cors from "cors"

import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials : true 
}))

app.use(express.json({limit : "150kb"}))

app.use(express.urlencoded({extended: true,
    limit:"150kb" 
}))

app.use( express.static("public"))

app.use(cookieParser())

// import routes 

import router from "./routes/user.routes.js"

// route declaration toh ab route ko lana padega toh we the middleware 
app.use("/api/v1/users", router)

import videoRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/user.routes.js";

app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

export {app};