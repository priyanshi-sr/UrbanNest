import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
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

app.use('/api/user/', userRouter);
app.use('/api/auth', authRouter);

app.listen(8000,()=>{
    console.log("Server started on port 8000");
});
