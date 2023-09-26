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
const db_1 = require("../utils/db");
const UserController = {
    getProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                console.log(req.user);
                const db = (0, db_1.getDatabase)();
                const userCollection = db.collection('users');
                const result = yield userCollection.findOne({ id: userId });
                if (!result) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.send(result.projects);
            }
            catch (error) {
                console.error(error);
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    getAllTaskByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const db = (0, db_1.getDatabase)();
                const userCollection = db.collection('users');
                const result = yield userCollection.findOne({ id: userId });
                if (!result) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // use aggregation to get all tasks
                const tasks = yield userCollection.aggregate([
                    {
                        $match: { id: userId }
                    },
                    {
                        $lookup: {
                            from: "projects",
                            localField: "projects",
                            foreignField: "id",
                            as: "projects"
                        }
                    },
                    {
                        $unwind: "$projects"
                    },
                    {
                        $lookup: {
                            from: "tasks",
                            localField: "projects.tasks",
                            foreignField: "id",
                            as: "projects.tasks"
                        }
                    },
                    {
                        $unwind: "$projects.tasks"
                    },
                    {
                        $project: {
                            "projects.tasks": 1,
                            _id: 0
                        }
                    }
                ]).toArray();
                console.log(tasks);
                res.send(tasks);
            }
            catch (error) {
                console.error(error);
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
};
exports.default = UserController;
