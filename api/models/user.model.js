import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: "https://i.ibb.co/yncvwSRK/profile-circle-svgrepo-com.png"
    }
}, {timestamps: true});

const User=mongoose.model('User',userSchema);

export default User;