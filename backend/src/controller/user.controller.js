import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import { User } from '../model/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler( async(req,res) => {
    const {fullname,email,username,password} = req.body
    if(
        [fullname,email,username,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser) throw new ApiError(409,"User with email or username exists")
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required")
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar) throw new ApiError(400,"Avatar file is required on cloudinary")
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        password,
        username: username.toLowerCase()
    })
    // remove password and refrest token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
    // check for usr creation 
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})


const loginUser = asyncHandler( async(req,res) => {
    // req body se data le aao
    const {email,username,password} = req.body
    
    // username or email
    if(!username && !email){
        throw new ApiError(400, "Username or Email is required")
    }

    // find the user
    const user = await User.findOne({
        $or : [{username},{email}]
    })
    if(!user){
        throw new ApiError(401, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(401, "Invalid User credentials")

    // access and refresh token generate
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    // send cookies
    const loggendInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggendInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler( async (req,res) => {
    const logout = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    if(!logout) throw new ApiError(400,"Can't logout user")
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler( async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken) throw new ApiError(401, "Unauthorized request")
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user) throw new ApiError(401,"Invalid refresh token")
        if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(402,"Refresh token has expired")
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler( async(req,res) =>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect) throw new ApiError(400,"Invalid password");
    user.password = newPassword;
    await user.save({validateBeforeSave: false});
    return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser = asyncHandler( async(req,res) =>{
    const {refreshToken} = req.cookies
    if(!refreshToken) throw new ApiError(400,"Token exipred")
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler( async(req,res) => {
    const {fullname, email} = req.body
    if(!fullname || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
            }
        },
        {new: true}
        ).select("-password")

        return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler( async(req,res) => {
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath) throw new ApiError(400,"Avatar file is missing");
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url) throw new ApiError(400,"Error uploading avatar file")
    const user = await User.findByIdAndUpdate(req.user?._id,{   
        $set: {
            avatar: avatar.url
        }
    },{new: true}).select("-password")

    return res.status(200).json(new ApiResponse(200,user,"Avatar updated successfully"))
})

const getUserProfile = asyncHandler( async(req,res) => {
    const {username} = req.params;
    if(!username?.trim()) throw new ApiError(400, "Username is missing")
    const user = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: 'lists',
                localField: '_id',
                foreignField: 'owner',
                as: 'lists',
                pipeline: [
                    {
                        $lookup:{
                            from: 'tasks',
                            localField: 'tasks',
                            foreignField: '_id',
                            as: 'tasks'
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                totalLists: {
                    $size: "$lists"
                }
            }
        },
        {
            $project: {
                username: 1,
                fullname: 1,
                avatar: 1,
                totalLists: 1,
                lists: {
                    title: 1,
                    description: 1,
                    tasks: {
                        title: 1,
                        description: 1
                    }
                }
            }
        }
    ])
    if(!user?.length){
        throw new ApiError(404, "Channel does not exist")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, user[0], "User fetched successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserProfile
}