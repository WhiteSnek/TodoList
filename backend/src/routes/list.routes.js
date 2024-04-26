import { Router } from "express";
import {
    createList,
    updateList,
    deleteList,
    getAllLists
} from '../controller/list.controller.js'
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createList).get(getAllLists)
router.route("/:listId").patch(updateList).delete(deleteList)

export default router;
