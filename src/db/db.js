import mongoose from "mongoose";
import { config } from "dotenv";

config();

async function connectDb() {
    try {
        const connect = await mongoose.connect(process.env.DATABASEURI)
        if (connect) {
            console.log("database connected sucessfully")
        }
    } catch (error) {
        console.log("error in connecting database", error)
    }
}

export default connectDb
