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
                const ifColumnExists = yield ColumnsCollection.findOne({ id: task.columnId });
                if (!ifColumnExists) {
                    return res.status(404).json({ message: 'Column not found' });
                }
                yield ColumnsCollection.updateOne({ id: task.columnId }, {
                    // push the task id to the column inside the task array 
                    $set: {
                        tasks: [...ifColumnExists.tasks, task_.id]
                    }
                });
                TaskCollection.insertOne(task_);
                // console.log(task_.id);
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
    },
    searchTaskByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const db = (0, db_1.getDatabase)();
                const TaskCollection = db.collection('tasks');
                const result = yield TaskCollection.find({ createdBy: userId }).toArray();
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
    // assign task to the user
    assignTaskToUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.body;
                console.log(taskId);
                const userId = req.user.id;
                const db = (0, db_1.getDatabase)();
                const TaskCollection = db.collection('tasks');
                const UserCollection = db.collection('users');
                const result = yield TaskCollection.findOne({ id: taskId });
                console.log(userId);
                console.log(result);
                if (!result) {
                    console.log();
                    return res.status(404).json({ message: 'Task not ,', taskId });
                }
                const userExists = yield UserCollection.findOne({ id: userId });
                if (!userExists) {
                    return res.status(404).json({ message: 'User not found' });
                }
                yield TaskCollection.updateOne({ id: taskId }, {
                    $set: {
                        assignedTo: [...result.assignedTo, userId]
                    }
                });
                res.send(Object.assign(Object.assign({}, result), { "message": "task assigned" }));
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    searchTaskByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                const userId = req.user.id;
                console.log(userId);
                const db = (0, db_1.getDatabase)();
                const TaskCollection = db.collection('tasks');
                const result = yield TaskCollection.find({ createdBy: userId }).toArray();
                if (!result) {
                    return res.status(404).json({ message: 'Task not found' });
                }
                // const taskResult = result.filter((task) => {
                //     return task.name.includes(name)
                // })
                // give task that matches name and rank them according to similarity of  name found and given name
                const taskResult = result.map((task) => {
                    return Object.assign(Object.assign({}, task), { rank: task.name.length - name.length });
                }).sort((a, b) => {
                    return a.rank - b.rank;
                });
                res.send(taskResult.splice(0, 10));
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
};
exports.default = taskController;
