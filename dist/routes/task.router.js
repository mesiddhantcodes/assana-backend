"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_controller_1 = __importDefault(require("../controller/task.controller"));
const express_1 = require("express");
const Authentication_middleware_1 = require("../middleware/Authentication.middleware");
const router = (0, express_1.Router)();
router.post('/', Authentication_middleware_1.verifyJWTMiddleware, task_controller_1.default.create);
router.get('/:taskId', Authentication_middleware_1.verifyJWTMiddleware, task_controller_1.default.get);
router.put('/:taskId', Authentication_middleware_1.verifyJWTMiddleware, task_controller_1.default.updateTask);
router.patch('/moveTask', Authentication_middleware_1.verifyJWTMiddleware, task_controller_1.default.moveTask);
router.put('/user/assigntask', Authentication_middleware_1.verifyJWTMiddleware, task_controller_1.default.assignTaskToUser);
router.get('/search/:name', Authentication_middleware_1.verifyJWTMiddleware, task_controller_1.default.searchTaskByName);
exports.default = router;
