import {User} from "../models/userModels.js";
import { comparePassword, hashPassword } from "../utils/authUtil.js";
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {
    try {
        const {name, email,password} = req.body;

        //check user
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"Account already exists "
            })
        }

        // register user
        const hashedPassword = await hashPassword(password)

        //save user
        const user = new User({name,email,password: hashedPassword}).save();
        res.status(201).send({
            success:true,
            message: "User Registered Successfully",
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error in registeration",
            error
        })
    }
};

//login

export const loginController = async(req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Username or Password",
            })
        }
        //check user
        const user = await User.findOne({email});
        if(!user){
            return res.status(200).send({
                success:false,
                message:"User not registered",
            })
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password",
            })
        }
        //token

        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                _id: user._id,
                name:user.name,
                email:user.email,
            },token,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        });
    }
};

//test controller
export const testController = (req,res) => {
    res.send("Protected Route");
}