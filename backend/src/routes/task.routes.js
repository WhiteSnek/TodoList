import { Router } from "express";
import {
    addTask,
    deleteTask,
    updateTask,
    toggleStatus,
    getAllTasks
} from '../controller/task.controller.js'
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/:listId").post(addTask).get(getAllTasks)
router.route("/task/:taskId").patch(updateTask).delete(deleteTask)
router.route("/toggle/:taskId").patch(toggleStatus)

export default router;
