import User, { registerUser } from '../interfaces/User.interface';
import { Request, Response } from 'express';
import { getDatabase } from '../utils/db';

import { generateJWT } from '../middleware/Authentication.middleware';
import { comparePassword, encryptPassword } from '../utils/bcrypt';
const AuthController = {
    async login(req: Request, res: Response) {
        const user: User = req.body;
        const db = getDatabase();
        const userCollection = db.collection('users');
        const userExists = await userCollection.findOne({ email: user.email });
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        const password = user.password;
        if (!await comparePassword(password, userExists.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const AccessToken = generateJWT(user);
        res.status(200).json({
            status: true,
            content: {
                data: {
                    id: userExists.id,
                    name: userExists.name,
                    email: userExists.email,
                    userName: userExists.userName,
                },
                meta: {
                    AccessToken,
                }
            }
        });;
    },
    async register(req: Request, res: Response) {
        const user: User = req.body;
        var user_=registerUser(user.username,user.email,user.password,user.name);
        const db = getDatabase();
        const userCollection = db.collection('users');
        const userExists = await userCollection.findOne({ email: user_.email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const userNameTaken = await userCollection.findOne({ username: user_.username });
        if (userNameTaken) {
            return res.status(409).json({ message: 'Username already taken' });
        }
        const password_ = user_.password;
        user_.password = await encryptPassword(password_);
        await userCollection.insertOne(user_);
        return res.status(201).json({ message: 'User created' });


    },
};

export default AuthController;