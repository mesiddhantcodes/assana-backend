"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_controller_1 = __importDefault(require("../controller/task.controller"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/', task_controller_1.default.create);
router.get('/:taskId', task_controller_1.default.get);
router.put('/:taskId', task_controller_1.default.updateTask);
exports.default = router;
