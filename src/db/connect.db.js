import { DB_Name }from "../constants.js"
import mongoose from "mongoose"

const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`\nMongoDB Connected at ${connectionInstance.connection.host}:${connectionInstance.connection.port}`);        
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}


export default connectDB