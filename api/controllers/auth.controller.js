import User from '../models/user.model.js';
import Seller from '../models/seller.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Subscription from '../models/subscription.model.js';

export const signup = async(req,res,next)=>{

    const {username,email,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password: hashedPassword});
    
    try{
        await newUser.save();
        res.status(201).json('User created successfully');
    }catch(error){
        next(error);
        
    }
}

export const signin = async(req,res,next)=>{
    const{email,password}=req.body;

    try {
        const validUser = await User.findOne({email: email});
        if(!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword =bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Invalid credentials'));

        const token =jwt.sign({id: validUser._id},process.env.JWT_SECRET)

        const {password: pass, ...restInfo} = validUser._doc

        res
            .cookie('access_token',token,{httpOnly: true, expires: new Date(Date.now()+60*60*24*30*1000)})
            .status(200)
            .json(restInfo)

    } catch (error) {
        next(error);
    }
}

export const google = async(req,res,next)=>{

    try {
        const user=await User.findOne({email: req.body.email})
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res
              .cookie('access_token', token, { 
                  httpOnly: true, 
                  expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000)
              })
              .status(200)
              .json(rest);
          }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, { 
                    httpOnly: true, 
                    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000)
                })
                .status(200)
                .json(rest);
                }
    } catch (error) {
        next(error)
    }

}

export const signOut = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
  };


  //Seller Auth


  export const signup2 = async(req,res,next)=>{

    const {username,email,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser=new Seller({username,email,password: hashedPassword});
    
    try{
        await newUser.save();
        res.status(201).json('User created successfully');
    }catch(error){
        next(error);
        
    }
}

export const signin2 = async(req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await Seller.findOne({ email: email });
        if (!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Invalid credentials'));

        const token2 = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET2);

        const { password: pass, ...restInfo } = validUser._doc;

        // Fetch subscription details
        const subscription = await Subscription.findOne({
            userId: validUser._id,
            userType: 'seller',
            status: 'active',
            endDate: { $gt: new Date() }
        });

        // Create or update the subscription cookie
        if (subscription) {
            const subscriptionData = {
                id: subscription._id.toString(),
                planType: subscription.planType,
                status: subscription.status,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
                amount: subscription.amount
            };

            res.cookie('seller_subscription', JSON.stringify(subscriptionData), {
                httpOnly: false, // Allow JavaScript access
                expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000) // 30 days
            });
        }

        res
            .cookie('access_token2', token2, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000) })
            .status(200)
            .json({ ...restInfo, subscription }); // Include subscription in the response

    } catch (error) {
        next(error);
    }
}

export const google2 = async(req,res,next)=>{

    try {
        const user=await Seller.findOne({email: req.body.email})
        if (user) {
            const token2 = jwt.sign({ id: user._id }, process.env.JWT_SECRET2);
            const { password: pass, ...rest } = user._doc;
            res
              .cookie('access_token2', token2, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000) })
              .status(200)
              .json(rest);
          }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new Seller({
                username: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token2 = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET2);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token2', token2, { httpOnly: true, expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000) })
                .status(200)
                .json(rest);
                }
    } catch (error) {
        next(error)
    }

}

export const signOut2 = async (req, res, next) => {
    try {
      res.clearCookie('access_token2');
      res.clearCookie('seller_subscription');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
  };