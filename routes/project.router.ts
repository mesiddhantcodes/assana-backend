import { Router } from 'express';
import ProjectController from '../controller/project.controller';
const router=Router();




router.post('/',ProjectController.create);
router.put('/:projectId',ProjectController.updateProject);
router.post('/:projectId/column',ProjectController.addColumn);
router.put('/:projectId/column/:columnId',ProjectController.updateColumn);
router.get('/:projectId',ProjectController.getProjectById);
router.get('/:projectId/column',ProjectController.getColumnsByProjectId);
export default router;