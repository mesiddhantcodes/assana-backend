"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Task_interface_1 = require("../interfaces/Task.interface");
const db_1 = require("../utils/db");
const Task_interface_2 = require("../interfaces/Task.interface");
const taskController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = req.body;
                let db = (0, db_1.getDatabase)();
                const createdBy = req.user.id;
                var task_ = (0, Task_interface_1.createTask)(task.name, task.deadline, task.priority, createdBy, task.columnId);
                const TaskCollection = db.collection('tasks');
                const ColumnsCollection = db.collection('columns');
                yield ColumnsCollection.updateOne({ id: task.columnId }, {
                    $push: {
                        //just push the task id in the column
                        tasks: task_.id
                    }
                });
                res.send(Object.assign(Object.assign({}, task_), { "message": "task created" }));
            }
            catch (error) {
                console.error(error);
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const db = (0, db_1.getDatabase)();
                const TaskCollection = db.collection('tasks');
                const result = yield TaskCollection.findOne({ id: taskId });
                if (!result) {
                    return res.status(404).json({ message: 'Task not found' });
                }
                res.send(result);
            }
            catch (error) {
                console.error(error);
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const { name, deadline, priority, projectId } = req.body;
                let db = (0, db_1.getDatabase)();
                const TaskCollection = db.collection('tasks');
                const ifTaskExists = yield TaskCollection.findOne({ id: taskId });
                if (!ifTaskExists) {
                    return res.status(404).json({ message: 'Task not found' });
                }
                yield TaskCollection.updateOne({ id: taskId }, {
                    $set: {
                        name: name,
                        deadline: deadline,
                        priority: priority,
                        projectId: projectId,
                        updatedAt: new Date()
                    }
                });
                res.send(Object.assign(Object.assign({}, ifTaskExists), { "message": "task updated" }));
            }
            catch (error) {
                console.error(error);
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    moveTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { initialColumnId, targetColumnId, taskId } = req.body;
            const result = (0, Task_interface_2.moveTaskById)(initialColumnId, targetColumnId, taskId);
            if ((yield result).success) {
                return res.send({ "message": "column moved" });
            }
            return res.status(404).json({ message: 'Column not found' });
        });
    }
};
exports.default = taskController;
