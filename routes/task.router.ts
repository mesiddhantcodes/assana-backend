import taskController from "../controller/task.controller";
import { Router } from "express";
import { verifyJWTMiddleware } from "../middleware/Authentication.middleware";

const router = Router();


router.post('/',verifyJWTMiddleware, taskController.create);
router.get('/:taskId',verifyJWTMiddleware, taskController.get);
router.put('/:taskId', verifyJWTMiddleware,taskController.updateTask);
router.patch('/moveTask', verifyJWTMiddleware,taskController.moveTask);
router.put('/user/assigntask', verifyJWTMiddleware,taskController.assignTaskToUser);
router.get('/search/:name', verifyJWTMiddleware,taskController.searchTaskByName);
export default router;
