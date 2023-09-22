import { Request, Response } from 'express';
import Task, { createTask } from '../interfaces/Task.interface';
import { generateId } from '../utils/snowflake';
import { getDatabase } from '../utils/db';



const taskController = {
    async create(req: Request, res: Response) {
        try {
            const task: Task = req.body;
            let db = getDatabase();
            var task_ = createTask(task.name, task.deadline, task.priority, task.projectId);

            const TaskCollection = db.collection('tasks');
            const ProjectCollection = db.collection('projects');
            const project = await ProjectCollection.findOne({ id: task.projectId });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            project.tasks.push(task_.id);
            await ProjectCollection.updateOne(
                {id: task_.projectId},
                {
                    $set:
                    {
                        tasks: project.tasks
                    }
                });
            await TaskCollection.insertOne(task_);
            res.send({ "message": "task created" });
        } catch (error) {
            console.error(error);
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async get(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
            const db = getDatabase();

            const TaskCollection = db.collection('tasks');
            const result = await TaskCollection.findOne({ id: taskId });
            if (!result) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.send(result);
        } catch (error) {
            console.error(error);
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async updateTask(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
            const { name, deadline, priority, projectId } = req.body;
            let db = getDatabase();
            const TaskCollection = db.collection('tasks');
            const ifTaskExists = await TaskCollection.findOne({ id: taskId });
            if (!ifTaskExists) {
                return res.status(404).json({ message: 'Task not found' });
            }
            await TaskCollection.updateOne(
                { id: taskId },
                {
                    $set:
                    {
                        name: name,
                        deadline: deadline,
                        priority: priority,
                        projectId: projectId,
                        updatedAt: new Date()

                    }
                });
            res.send({ ...ifTaskExists, "message": "task updated" });
        } catch (error) {
            console.error(error);
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

    }
    


};

export default taskController;
