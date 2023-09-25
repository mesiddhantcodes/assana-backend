"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./utils/db");
const project_router_1 = __importDefault(require("./routes/project.router"));
const task_router_1 = __importDefault(require("./routes/task.router"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const swagger_ui_express_1 = require("swagger-ui-express");
const cors = require('cors');
// import cors from 'cors';
const app = (0, express_1.default)();
const port = 3000;
(0, db_1.connectToDatabase)();
app.use(express_1.default.json());
app.use(cors());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/project', project_router_1.default);
app.use('/task', task_router_1.default);
app.use('/auth', auth_router_1.default);
app.use('/swagger', swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(require('../swagger_output.json')));
app.get('/', (req, res) => {
    res.send('Hello, Express.js with TypeScript!');
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
