"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const Authentication_middleware_1 = require("../middleware/Authentication.middleware");
const router = (0, express_1.Router)();
router.get('/projects', Authentication_middleware_1.verifyJWTMiddleware, user_controller_1.default.getProjects);
router.get('/tasks', Authentication_middleware_1.verifyJWTMiddleware, user_controller_1.default.getAllTaskByUserId);
exports.default = router;
