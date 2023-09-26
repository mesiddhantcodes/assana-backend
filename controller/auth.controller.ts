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
        
        user.id = userExists.id;
        user.name = userExists.name;
        user.userName = userExists.userName;
        user.email = userExists.email;


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
        try {

            const { name, email, password, userName } = req.body;
            var user_ = registerUser(name, email, password, userName);
           
            const db = getDatabase();
            const userCollection = db.collection('users');
            const userExists = await userCollection.findOne({ email: email });
            if (userExists) {
                return res.status(409).json({ message: 'User already exists' });
            }
            const userNameTaken = await userCollection.findOne({ userName: userName });
            if (userNameTaken) {
                return res.status(409).json({ message: 'Username already taken' });
            }
            const password_ = password;
            user_.password = await encryptPassword(password_);
            await userCollection.insertOne(user_);
            return res.status(201).json({ message: 'User created' });
        }
        catch (error) {
            // console.error(error);
            // console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

    },
};

export default AuthController;