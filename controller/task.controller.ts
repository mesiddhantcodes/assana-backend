import { Request, Response } from 'express';
import Task, { createTask } from '../interfaces/Task.interface';
import { generateId } from '../utils/snowflake';
import { getDatabase } from '../utils/db';
import { moveTaskById } from '../interfaces/Task.interface';



const taskController = {
    async create(req: Request, res: Response) {
        try {
            const task: Task = req.body;
            let db = getDatabase();
            const createdBy = req.user.id;
            var task_ = createTask(task.name, task.deadline, task.priority, createdBy, task.columnId);
            const TaskCollection = db.collection('tasks');
            const ColumnsCollection = db.collection('columns');

            await ColumnsCollection.updateOne(
                { id: task.columnId },
                {
                    $push:
                    {
                        //just push the task id in the column
                        tasks: task_.id
                    }
                });
            res.send({ ...task_, "message": "task created" });
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

    },
    async moveTask(req: Request, res: Response) {
        const { initialColumnId, targetColumnId, taskId } = req.body;
        const result = moveTaskById(initialColumnId, targetColumnId, taskId);
        if ((await result).success) {
            return res.send({ "message": "column moved" });
        }
        return res.status(404).json({ message: 'Column not found' });
    }



};

export default taskController;
