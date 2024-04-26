import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { List } from '../model/list.model.js'
import { Task } from '../model/task.model.js'
import mongoose from 'mongoose';

const createList = asyncHandler( async(req,res) => {
    const user = req.user._id;
    const {title,description} = req.body;
    if(!title || !description) throw new ApiError(400,"Title and description is required")
    const list = await List.create({
        title,
        description,
        owner: new mongoose.Types.ObjectId(user)
    })
    if(!list) throw new ApiError(400,"Error creating list");
    return res.status(200).json(new ApiResponse(200,list,"List created successfully"))
})

const updateList = asyncHandler( async(req,res) => {
    const {listId} = req.params;
    const {title,description} = req.body;
    if(!title || !description) throw new ApiError(400,"Title and description is required")
    const list = await List.findByIdAndUpdate(listId,{
        $set:{
            title,
            description
        }
    },{new: true})
    if(!list) throw new ApiError(400,"Error updating list");
    return res.status(200).json(new ApiResponse(200,list,"List updated successfully"))
})
// TODO: jab list delete hue to uske sare tasks bhi delete ho jae
const deleteList = asyncHandler( async(req,res) => {
    const {listId} = req.params;
    await Task.deleteMany({ list: new mongoose.Types.ObjectId(listId) });
    await List.findByIdAndDelete(listId);
    return res.status(200).json(new ApiResponse(200,{},"List deleted successfully"))
})

const getAllLists = asyncHandler( async(req,res) => {
    const userId = req.user._id;
    const lists = await List.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        }
    ])
    if(!lists) throw new ApiError(400,"Error fetching lists");
    return res.status(200).json(new ApiResponse(200,lists,"All lists fetched successfully"))
})

export {
    createList,
    updateList,
    deleteList,
    getAllLists
}