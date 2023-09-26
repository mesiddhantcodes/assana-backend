import mongodb from "mongodb";
import { Request, Response } from "express";
import Project, { createProject } from "../interfaces/Project.interface";
import { generateId } from "../utils/snowflake";
import { getDatabase } from "../utils/db";
import { createColumn } from "../interfaces/Columns.interface";
const ProjectController = {

    async create(req: Request, res: Response) {
        try {
            
            const {name,description}=req.body;
            const createdBy = req.user.id;
            console.log(req.user);

            var project_ = createProject(name, description, createdBy);
            
            let db = getDatabase();
            const ProjectCollection = db.collection('projects');
            const UserCollection=db.collection('users');
            const user=await UserCollection.findOne({id:createdBy});
            if(!user){
                return res.status(404).json({ message: 'User not found' });
            }
            if(user.projects.includes(project_.id)){
                return res.send({ ...project_, "message": "project created" });
            }
            await UserCollection.updateOne(
                { id: createdBy },
                {
                    $set:
                    {
                        projects: [...user.projects,project_.id]
                    }
                });
            await ProjectCollection.insertOne(project_);
            res.send({ ...project_, "message": "project created" });
        }
        catch (error) {
            // console.error(error);
            // console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
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
        await projectCollection.updateOne(
            { id: projectId },
            {
                $set:
                {
                    columns: [...ifProjectExists.columns, colmun_.id]
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