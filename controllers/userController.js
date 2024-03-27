const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Register a user
//@route post /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }
  
    const userAvailable = await User.findOne({ email });
  
    if (userAvailable) {
      return res.status(400).json({ message: "User already registered!" });
    }
  
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
      if (user) {
        return res.status(201).json({ _id: user.id, email: user.email });
      } else {
        throw new Error("User data is not valid"); // Consider a more informative message
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Registration failed" });
    }
  });
  

//@desc login a user
//@route post /api/users/login
//@access public
const loginUser = asyncHandler(async (req,res)=>{
  const {email, password} = req.body;
  if(!email || !password){
    res.status(400)
    throw new Error("All fields are mandatory")
  } 
  //check if user present In our User db or not 
  const user = await User.findOne({email});
  //compare pass with hashedpass]
  try{
  if(user && (await bcrypt.compare(password, user.password))){
    const accessToken = jwt.sign({
      user:{
        username: user.username,
        email: user.email,
        id:user.id,
      },
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn: "15m"}
    );
    res.status(200).json({accessToken})
  }} catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Registration failed" });
    }
});
// @desc current userinfo
// @router poost /api/users/current
// @access private
const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser }