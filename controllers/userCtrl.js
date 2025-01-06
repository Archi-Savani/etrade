const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const generateToken = require("../config/jwtToken")
const {generateRefreshToken} = require("../config/refreshtoken")
const validateMongoDbId = require("../utils/validateMongodbId")
const jwt = require("jsonwebtoken")
// const sendEmail = require("./emailCtrl")
// const crypto = require("crypto")

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
        const refreshToken = await generateRefreshToken(findUser?.id)
        const updateuser = await User.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken
        }, {
            new: true
        })
        res.cookie('refreshToken', refreshToken ,{
            htttpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
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

// handle refresh token
const handleRefreshToken = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error('NO REfresh Token in cookies')
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken})
    if(!user) throw new Error("No refresh token present in db or not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded ) => {
        if(err || user.id !== decoded.id){
            throw new Error("There is somthing wrong with refresh token")
        }
        const accessToken = generateToken(user?._id)
        res.json(accessToken)
    })
    res.json(user)
})

// logout functionality

const logout = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error('NO REfresh Token in cookies')
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken})
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204);
})

// update user

const updateUser = asyncHandler(async (req,res) => {
    const {_id} = req.user;
    validateMongoDbId(_id)
    try{
        const updateUser = await User.findByIdAndUpdate(_id, {
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
    validateMongoDbId(id)
    try{
        const getSingleUser = await User.findById(id)
        res.json({
            getSingleUser,
        })
    }catch (error) {
        throw new Error(error)
    }
})

const blockUser = asyncHandler(async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        },{
            new: true,
        });
        res.json({
            message: "user Blocked"
        })
    }catch (error){
        throw new Error(error)
    }
})
const unblockUser = asyncHandler(async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        },{
            new: true,
        })
        res.json({
            message: "user UnBlocked"
        })
    }catch (error){
        throw new Error(error)
    }
})

// delete user

const deleteUser = asyncHandler(async (req,res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const deleteUser = await User.findByIdAndDelete(id)
        res.json({
            deleteUser,
        })
    }catch (error) {
        throw new Error(error)
    }
})

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user; // Extract user ID from the authenticated user
    const { password } = req.body; // Get the new password from the request body

    validateMongoDbId(_id); // Validate that the ID is a valid MongoDB ID

    // Find the user by ID
    const user = await User.findById(_id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (password) {
        // Update the password
        user.password = password;

        // Create a new password reset token and expiration
        const resetToken = user.createPasswordResetToken();

        // Log the reset token for debugging purposes
        console.log("Reset Token Created:", resetToken);

        // Save the user to persist the changes (password, reset token, expiration)
        await user.save();

        res.json({
            message: "Password updated successfully",
            resetToken, // Send the reset token in the response
            updatedUser: user, // Send the updated user document
        });
    } else {
        res.status(400).json({ message: "Password is required" });
    }
});







module.exports = {createUser, loginUserCtrl, getallUser , getSingleUser , deleteUser, updateUser, handleRefreshToken, logout, unblockUser,blockUser , updatePassword}