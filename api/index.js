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
import staffRoutes from './routes/staff.route.js';
import staffListingRoutes from './routes/staffListing.route.js';
import staffSubscriptionRoutes from './routes/staffSubscription.route.js';
import cors from 'cors';
import transactionRoutes from './routes/transaction.route.js';
import subscriptionPlanRoutes from './routes/subscriptionPlan.route.js';
import adminRouter from './routes/admin.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB!");
    }).catch((err)=>{
        console.log(err);
    })


const __dirname = path.resolve();


const app = express();

// Increase the limit for JSON and URL-encoded request bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors());

app.listen(3000,()=>{
    console.log("Server is running on port 3000!!");
})

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);
app.use('/api/saved', savedPropertyRouter);
app.use('/api/demo-payment', demoPaymentRouter);
app.use('/api/staff', staffRoutes);
app.use('/api/staff-listing', staffListingRoutes);
app.use('/api/staff-subscription', staffSubscriptionRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);
app.use('/api/admin', adminRouter);


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