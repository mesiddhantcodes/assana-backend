import { getDatabase } from "../utils/db";
import { Request, Response } from "express";

const UserController =  {
    async getProjects(req: Request, res: Response) {
        try {
            const userId=req.user.id;
            console.log(req.user);
            const db = getDatabase();
            const userCollection = db.collection('users');
            const result = await userCollection.findOne({id:userId} )
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.send(result.projects);
        } catch (error) {
            console.error(error);
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getAllTaskByUserId(req: Request, res: Response) {
        try {
            const userId=req.user.id;
            const db = getDatabase();
            const userCollection = db.collection('users');
            const result = await userCollection.findOne({id:userId} )
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }
            // use aggregation to get all tasks
            const tasks=await userCollection.aggregate([
                {
                    $match: { id: userId }
                },
                {
                    $lookup:
                    {
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
                    $lookup:
                    {
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
        } catch (error) {
            console.error(error);
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

    }

}


export default UserController;
