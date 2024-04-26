import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../model/task.model.js";
import mongoose from "mongoose";

const addTask = asyncHandler(async (req, res) => {
  const { listId } = req.params;
  const { title} = req.body;
  if (!title)
    throw new ApiError(400, "Title is required");
  const task = await Task.create({
    title,
    list: new mongoose.Types.ObjectId(listId),
  });
  if (!task) throw new ApiError(400, "Error creating task");
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task added successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  await Task.findByIdAndDelete(taskId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;
  if (!title)
    throw new ApiError(400, "Title is required");
  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        title,
      },
    },
    { new: true }
  );
  if (!task) throw new ApiError(400, "Error updating task");
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const toggleStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  task.isActive = !task.isActive;
  const updatedTask = await task.save();
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Status toggled successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
  const { listId } = req.params;
  const tasks = await Task.aggregate([
    {
      $match: {
        list: new mongoose.Types.ObjectId(listId),
      },
    },
  ]);
  if (!tasks) throw new ApiError(400, "Error fetching tasks");
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export { addTask, deleteTask, updateTask, toggleStatus, getAllTasks };
