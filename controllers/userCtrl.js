const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const generateToken = require("../config/jwtToken")

const createUser = asyncHandler(async (req,res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email})
    if(!findUser){
        const newUser = User.create(req.body)
        res.json(newUser)
    }else {
      throw new Error("User Already Exists")
    }
})

// login user

const loginUserCtrl = asyncHandler(async(req,res) => {
    const {email,password} = req.body;
    const findUser = await User.findOne({ email})
    if(findUser && await findUser.isPasswordMatched(password)){
        res.json({
            _id: findUser?._id,
            name: findUser?.name,
            email: findUser?.email,
            token: generateToken(findUser?._id)
        })
    }else {
        throw new Error("Invalid credentials")
    }
})

// update user

const updateUser = asyncHandler(async (req,res) => {
    const {id} = req.params;
    try{
        const updateUser = await User.findByIdAndUpdate(id, {
            name: req?.body.name,
            email: req?.body.email
        },{
            new: true
        })
        res.json(updateUser)
    }catch (error){
        throw new Error(error)
    }
})

// all user

const getallUser = asyncHandler(async(req,res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers)
    }catch (error){
        throw new Error(error)
    }
})

// single user

const getSingleUser = asyncHandler(async (req,res) => {
    console.log(req.params)
    const {id} = req.params;
    try{
        const getSingleUser = await User.findById(id)
        res.json({
            getSingleUser,
        })
    }catch (error) {
        throw new Error(error)
    }
})

// delete user

const deleteUser = asyncHandler(async (req,res) => {
    console.log(req.params)
    const {id} = req.params;
    try{
        const deleteUser = await User.findByIdAndDelete(id)
        res.json({
            deleteUser,
        })
    }catch (error) {
        throw new Error(error)
    }
})

module.exports = {createUser, loginUserCtrl, getallUser , getSingleUser , deleteUser, updateUser}