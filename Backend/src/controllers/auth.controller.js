const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model");


async function registerUserController(req,res){
    
    const {username,email,password} = req.body;


    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

     const isUSerAlreadyExists = await userModel.findOne ({
        $or :[{
            username: username
        }, {
            email: email
        }]
     })

     if(isUSerAlreadyExists){
        return res.status(400).json({message:"User already exists"});
     }   
 

     const hash = await bcrypt.hash(password,10);

     const user = await userModel.create({
        username: username,
        email: email,
        password: hash
     })

     const token = jwt.sign(
                {id: user._id, email: user.email},
                process.env.JWT_SECRET,
                {expiresIn: "1h"}
      )
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      })

      res.status(201).json({message:"User registered successfully",token:token})    
}
async function loginUserController(req,res){
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            token: token
        }
    });
}

async function logoutUserController(req,res){
    const token =req.cookies.token;
    if(token){
        await tokenBlacklistModel.create({token})
    }
  
     
    res.clearCookie("token");
    res.status(200).json({message:"User logged out successfully"});
    
}
async function getMeController(req,res){
      const user = await userModel.findById(req.user.id)

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message:"User fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
      })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};
