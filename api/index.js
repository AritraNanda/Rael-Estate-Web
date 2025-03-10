import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import savedPropertyRouter from './routes/savedProperty.route.js';
import path from 'path';
import demoPaymentRouter from './routes/demo.payment.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB!");
    }).catch((err)=>{
        console.log(err);
    })


const __dirname = path.resolve();


const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000,()=>{
    console.log("Server is running on port 3000!!");
})

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);
app.use('/api/saved', savedPropertyRouter);
app.use('/api/demo-payment', demoPaymentRouter);


app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})


app.use((err,req,res,next)=>{
    const statuscode = err.statuscode || 500;
    const message = err.message || 'Inrernal Server Error';
    return res.status(statuscode).json({
        success: false,
        statuscode: statuscode,
        message: message
    });
});