import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import listingRouter from './routes/listing.route.js';

dotenv.config()

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


const app = express()

app.use(express.json()); //allow json as input of the server

app.use(cookieParser());

//Routes
app.use('/api/user/', userRouter);
app.use('/api/auth/', authRouter);
app.use('/api/listing/', listingRouter);
//error handling Middleware
app.use((err,req,res,next)=>{
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})


app.listen(8000,()=>{
    console.log("Server started on port 8000");
});
