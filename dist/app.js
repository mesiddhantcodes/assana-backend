"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./utils/db");
const project_router_1 = __importDefault(require("./routes/project.router"));
const task_router_1 = __importDefault(require("./routes/task.router"));
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger_output.json');
const cors = require('cors');
const app = (0, express_1.default)();
const port = 3000;
(0, db_1.connectToDatabase)();
app.use(express_1.default.json());
app.use(cors());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/Project', project_router_1.default);
app.use('/Task', task_router_1.default);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
    res.send('Hello, Express.js with TypeScript!');
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
