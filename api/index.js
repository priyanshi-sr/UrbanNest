import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import listingRouter from './routes/listing.route.js';
import uploadRouter from './routes/upload.route.js';
import path from 'path';

dotenv.config()

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const __dirname =  path.resolve()

const app = express()

app.use(express.json()); //allow json as input of the server
// app.use('/public', express.static('public'));
app.use(cookieParser());

//Routes
app.use('/uploads', express.static('uploads'))
app.use('/api/user/', userRouter);
app.use('/api/auth/', authRouter);
app.use('/api/listing/', listingRouter);
app.use('/api/uploads/', uploadRouter)
app.use(express.static(path.join(__dirname, '/client/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client','dist','index.html'))
 })
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
