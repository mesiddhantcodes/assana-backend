import { Router } from 'express';
import ProjectController from '../controller/project.controller';
import { verifyJWTMiddleware } from '../middleware/Authentication.middleware';
import { ProjectPermissionMiddleware } from '../middleware/Project.middleware';
const router=Router();




router.post('/',verifyJWTMiddleware,ProjectController.create);
router.put('/:projectId',verifyJWTMiddleware,ProjectPermissionMiddleware,ProjectController.updateProject);
router.post('/:projectId/column',verifyJWTMiddleware,ProjectPermissionMiddleware,ProjectController.addColumn);
router.put('/:projectId/column/:columnId',verifyJWTMiddleware,ProjectPermissionMiddleware,ProjectController.updateColumn);
router.get('/:projectId',verifyJWTMiddleware,ProjectPermissionMiddleware,ProjectController.getProjectById);
router.get('/:projectId/column',verifyJWTMiddleware,ProjectPermissionMiddleware,ProjectController.getColumnsByProjectId);
router.patch('/moveColumn',verifyJWTMiddleware,ProjectController.moveColumn);
export default router;