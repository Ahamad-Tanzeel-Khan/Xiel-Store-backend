import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const connect = mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Mongoose Database")
    } catch (error) {
        console.log(err)
    }
}

export default connectDB;