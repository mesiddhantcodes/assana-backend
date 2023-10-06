import { Request, Response } from 'express';
import Task, { createTask } from '../interfaces/Task.interface';
import { generateId } from '../utils/snowflake';
import { getDatabase } from '../utils/db';
import { moveTaskById } from '../interfaces/Task.interface';
import RedisClient from '../utils/redis';



const taskController = {
    async create(req: Request, res: Response) {
        try {
            const task: Task = req.body;
            let db = getDatabase();
            const createdBy = req.user.id;
            var task_ = createTask(task.name, task.deadline, task.priority, createdBy, task.columnId);
            const TaskCollection = db.collection('tasks');
            const ColumnsCollection = db.collection('columns');
            const ifColumnExists = await ColumnsCollection.findOne({ id: task.columnId });
            if (!ifColumnExists) {
                return res.status(404).json({ message: 'Column not found' });
            }
            await ColumnsCollection.updateOne(
                { id: task.columnId },
                {
                    // push the task id to the column inside the task array 
                    $set:
                    {
                        tasks: [...ifColumnExists.tasks, task_.id]
                    }

                });
            TaskCollection.insertOne(task_);
            // console.log(task_.id);

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
    },
    async searchTaskByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const db = getDatabase();
            const TaskCollection = db.collection('tasks');
            const result = await TaskCollection.find({ createdBy: userId }).toArray();
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
    // assign task to the user
    async assignTaskToUser(req: Request, res: Response) {
        try {
            const { taskId } = req.body;
            console.log(taskId);
            const userId = req.user.id;

            const db = getDatabase();
            const TaskCollection = db.collection('tasks');
            const UserCollection = db.collection('users');
            const result = await TaskCollection.findOne({ id: taskId });
            console.log(userId);
            console.log(result);
            if (!result) {
                console.log()
                return res.status(404).json({ message: 'Task not ,', taskId });
            }
            const userExists = await UserCollection.findOne({ id: userId });
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }
            await TaskCollection.updateOne(
                { id: taskId },
                {
                    $set:
                    {
                        assignedTo: [...result.assignedTo, userId]
                    }
                });
            res.send({ ...result, "message": "task assigned" });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }

    },
    async searchTaskByName(req: Request, res: Response) {
        try {
            const { name } = req.params;
            const userId = req.user.id;
        
            if (await RedisClient.exists(name)) {
                const result = await RedisClient.get(name);
                return res.send(result);
            }
            const db = getDatabase();
            const TaskCollection = db.collection('tasks');
            const result = await TaskCollection.find({ createdBy: userId }).toArray();
            if (!result) {
                return res.status(404).json({ message: 'Task not found' });
            }
      
            
            const taskResult = result.map((task) => {
                return { ...task, rank: task.name.length - name.length }
            }).sort((a, b) => {
                return a.rank - b.rank;
            });
            await RedisClient.set(name, JSON.stringify(taskResult.splice(0, 10)));





            res.send(taskResult.splice(0, 10));
        } catch (error) {
                console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }




};

export default taskController;
