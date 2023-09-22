import mongodb from "mongodb";
import { Request, Response } from "express";
import Project, { createProject } from "../interfaces/Project.interface";
import { generateId } from "../utils/snowflake";
import { getDatabase } from "../utils/db";
import { createColumn } from "../interfaces/Columns.interface";
const ProjectController = {

    async create(req: Request, res: Response) {
        const project: Project = req.body;
        var project_ = createProject(project.name, project.description, project.createdBy);
        let db = getDatabase();
        const ProjectCollection = db.collection('projects');
        ProjectCollection.insertOne(project_);
        res.send({ ...project_, "message": "project created" });
    },
    async getProjectById(req: Request, res: Response) {
        const { projectId } = req.params;
        const db = getDatabase();
        const ProjectCollection = db.collection('projects');
        const result = await ProjectCollection.findOne({ id: projectId });
        if (!result) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.send(result);
    },
    async getColumnsByProjectId(req: Request, res: Response) {
        const { projectId } = req.params;
        const db = getDatabase();
        const ProjectCollection = db.collection('projects');
        const ColumnsCollection = db.collection('columns');
        const result = await ProjectCollection.findOne({ id: projectId });
        if (!result) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const columns = await ColumnsCollection.find({ projectId: projectId }).toArray();
        res.send(columns);
    },
    async updateProject(req: Request, res: Response) {
        const { projectId } = req.params;
        const { name } = req.body;
        let db = getDatabase();
        const ProjectCollection = db.collection('projects');
        const ifProjectExists = await ProjectCollection.findOne({ id: projectId });
        if (!ifProjectExists) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await ProjectCollection.updateOne(
            { id: projectId },
            {
                $set:
                {
                    name: name,
                    updatedAt: new Date()

                }
            });
        res.send({ ...ifProjectExists, "message": "project updated" });

    },
    async addColumn(req: Request, res: Response) {
        const { projectId } = req.params;
        const { name } = req.body;
        const db = getDatabase();
        const columnCollection = db.collection('columns');
        const projectCollection = db.collection('projects');
        const ifProjectExists = await projectCollection.findOne({ id: projectId });
        if (!ifProjectExists) {
            return res.status(404).json({ message: 'Project not found' });
        }
        var colmun_ = createColumn(projectId, name);
        await columnCollection.insertOne(colmun_);
        ifProjectExists.columns.push(colmun_.id);
        await projectCollection.updateOne(
            { id: projectId },
            {
                $set:
                {
                    columns: ifProjectExists.columns
                }
            });
        res.send({ ...colmun_, "message": "column created" });


    },
    async updateColumn(req: Request, res: Response) {
        const { projectId, columnId } = req.params;
        const { name } = req.body;
        const db = getDatabase();
        const columnCollection = db.collection('columns');
        const projectCollection = db.collection('projects');
        const ifProjectExists = await projectCollection.findOne({ id: projectId });
        const ifColumnExists = await columnCollection.findOne({ id: columnId });
        if (!ifColumnExists) {
            return res.status(404).json({ message: 'Column not found' });
        }
        if (!ifProjectExists) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await columnCollection.updateOne(
            { id: columnId },
            {
                $set:
                {
                    name: name,
                }
            });
        res.send({ project: ifColumnExists, "message": "column updated" });


    }
}

export default ProjectController;