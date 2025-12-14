import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import rootRouter from "./routes";
import cors from "cors";
import mongoose, { MongooseError } from "mongoose";
import { JWT_SECRET, MONGODB_URL } from "./config";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

async function main() {
    try {
        await mongoose.connect(MONGODB_URL);
        app.listen(3000, () => {
            console.log("Server is listening on port 3000");
        });
    } catch (error) {
        if (error instanceof MongooseError) {
            console.error("Error while connecting to MongoDB : " + error.message);
        } else {
            console.error("Error: " + error);
        }
    }
}

main();
