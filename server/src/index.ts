import express from "express";
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from "mongoose";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
// const MONGODB_URL = process.env.MONGODB_URL || ''
// console.log('MONGODB_URI:', process.env.MONGODB_URI)
const MONGODB_URI = (process.env.MONGODB_URI || '').replace(/['"]+/g, '').trim()


app.use(cors({
    origin :'http://localhost:5173'
}))

app.use(express.json())

app.get('/health',(req,res)=>{
    res.json({
        status: 'server is running',
        database:mongoose.connection.readyState === 1 ? "connected" : "disconnected"
})

})
mongoose.connect(MONGODB_URI).then(()=>{
    console.log("MongoDB connected successfully")
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
    })
}).catch((error)=>{
    console.log('MongoDB connection failed:', error)
    process.exit(1)

})



