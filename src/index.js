import dotenv from "dotenv"
import app from "./app.js";
import connectDB from "./db/connect.db.js";


dotenv.config({
    path: "../.env"
})


connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Application runnig on port http://localhost:${process.env.PORT}\n\n`);    
    })
}).catch((err)=>{
    console.log("\nMONGO db connection failed !!! ", err);
})



