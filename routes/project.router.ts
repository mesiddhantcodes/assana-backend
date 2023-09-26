import { Router } from 'express';
import ProjectController from '../controller/project.controller';
import { verifyJWTMiddleware } from '../middleware/Authentication.middleware';
const router=Router();




router.post('/',verifyJWTMiddleware,ProjectController.create);
router.put('/:projectId',verifyJWTMiddleware,ProjectController.updateProject);
router.post('/:projectId/column',verifyJWTMiddleware,ProjectController.addColumn);
router.put('/:projectId/column/:columnId',verifyJWTMiddleware,ProjectController.updateColumn);
router.get('/:projectId',verifyJWTMiddleware,ProjectController.getProjectById);
router.get('/:projectId/column',verifyJWTMiddleware,ProjectController.getColumnsByProjectId);
export default router;