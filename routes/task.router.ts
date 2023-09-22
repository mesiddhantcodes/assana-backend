import taskController from "../controller/task.controller";
import { Router } from "express";

const router = Router();


router.post('/', taskController.create);
router.get('/:taskId', taskController.get);
router.put('/:taskId', taskController.updateTask);
export default router;
