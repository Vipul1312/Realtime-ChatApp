import mongoose from "mongoose";

// function to connnect to the mongoose database
export const connnectDB = async()=>{
    try{
        mongoose.connection.on("connected", () => console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/mernRealtimeApp`)
    } catch (error){
        console.log(error);
    };
}