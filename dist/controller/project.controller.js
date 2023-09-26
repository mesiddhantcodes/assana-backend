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
const Project_interface_1 = require("../interfaces/Project.interface");
const db_1 = require("../utils/db");
const Columns_interface_1 = require("../interfaces/Columns.interface");
const ProjectController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = req.body;
                const createdBy = req.user.id;
                console.log(req.user);
                var project_ = (0, Project_interface_1.createProject)(name, description, createdBy);
                let db = (0, db_1.getDatabase)();
                const ProjectCollection = db.collection('projects');
                const UserCollection = db.collection('users');
                const user = yield UserCollection.findOne({ id: createdBy });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                if (user.projects.includes(project_.id)) {
                    return res.send(Object.assign(Object.assign({}, project_), { "message": "project created" }));
                }
                yield UserCollection.updateOne({ id: createdBy }, {
                    $set: {
                        projects: [...user.projects, project_.id]
                    }
                });
                yield ProjectCollection.insertOne(project_);
                res.send(Object.assign(Object.assign({}, project_), { "message": "project created" }));
            }
            catch (error) {
                // console.error(error);
                // console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    getProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            const db = (0, db_1.getDatabase)();
            const ProjectCollection = db.collection('projects');
            const result = yield ProjectCollection.findOne({ id: projectId });
            if (!result) {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.send(result);
        });
    },
    getColumnsByProjectId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            const db = (0, db_1.getDatabase)();
            const ProjectCollection = db.collection('projects');
            const ColumnsCollection = db.collection('columns');
            const result = yield ProjectCollection.findOne({ id: projectId });
            if (!result) {
                return res.status(404).json({ message: 'Project not found' });
            }
            const columns = yield ColumnsCollection.find({ projectId: projectId }).toArray();
            res.send(columns);
        });
    },
    updateProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            const { name } = req.body;
            let db = (0, db_1.getDatabase)();
            const ProjectCollection = db.collection('projects');
            const ifProjectExists = yield ProjectCollection.findOne({ id: projectId });
            if (!ifProjectExists) {
                return res.status(404).json({ message: 'Project not found' });
            }
            yield ProjectCollection.updateOne({ id: projectId }, {
                $set: {
                    name: name,
                    updatedAt: new Date()
                }
            });
            res.send(Object.assign(Object.assign({}, ifProjectExists), { "message": "project updated" }));
        });
    },
    addColumn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            const { name } = req.body;
            const db = (0, db_1.getDatabase)();
            const columnCollection = db.collection('columns');
            const projectCollection = db.collection('projects');
            const ifProjectExists = yield projectCollection.findOne({ id: projectId });
            if (!ifProjectExists) {
                return res.status(404).json({ message: 'Project not found' });
            }
            var colmun_ = (0, Columns_interface_1.createColumn)(projectId, name);
            yield columnCollection.insertOne(colmun_);
            yield projectCollection.updateOne({ id: projectId }, {
                $set: {
                    columns: [...ifProjectExists.columns, colmun_.id]
                }
            });
            res.send(Object.assign(Object.assign({}, colmun_), { "message": "column created" }));
        });
    },
    updateColumn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId, columnId } = req.params;
            const { name } = req.body;
            const db = (0, db_1.getDatabase)();
            const columnCollection = db.collection('columns');
            const projectCollection = db.collection('projects');
            const ifProjectExists = yield projectCollection.findOne({ id: projectId });
            const ifColumnExists = yield columnCollection.findOne({ id: columnId });
            if (!ifColumnExists) {
                return res.status(404).json({ message: 'Column not found' });
            }
            if (!ifProjectExists) {
                return res.status(404).json({ message: 'Project not found' });
            }
            yield columnCollection.updateOne({ id: columnId }, {
                $set: {
                    name: name,
                }
            });
            res.send({ project: ifColumnExists, "message": "column updated" });
        });
    }
};
exports.default = ProjectController;
