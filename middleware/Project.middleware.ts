import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../utils/db';

export const ProjectPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    let db = getDatabase();
    const { projectId } = req.params;
    const userId = req.user.id;
    const UserCollection = db.collection('users');
    const isProjectPresent = await UserCollection.findOne({ id: userId });
    if (isProjectPresent && !isProjectPresent.projects.includes(projectId)) {
        return res.status(401).json({ message: 'You dont have a access to Project !!!!! ' });
    }
    else {
        next();
    }
}


