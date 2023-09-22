"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = __importDefault(require("../controller/project.controller"));
const router = (0, express_1.Router)();
router.post('/', project_controller_1.default.create);
router.put('/:projectId', project_controller_1.default.updateProject);
router.post('/:projectId/column', project_controller_1.default.addColumn);
router.put('/:projectId/column/:columnId', project_controller_1.default.updateColumn);
router.get('/:projectId', project_controller_1.default.getProjectById);
router.get('/:projectId/column', project_controller_1.default.getColumnsByProjectId);
exports.default = router;
