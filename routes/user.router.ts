import { Router } from "express";
import usercontroller from "../controller/user.controller";
import { verifyJWTMiddleware } from "../middleware/Authentication.middleware";


const router = Router();


router.get('/projects',verifyJWTMiddleware, usercontroller.getProjects);
router.get('/tasks',verifyJWTMiddleware, usercontroller.getAllTaskByUserId);


export default router;