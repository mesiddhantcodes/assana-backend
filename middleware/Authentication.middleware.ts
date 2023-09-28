
import jwt from 'jsonwebtoken';
import User from '../interfaces/User.interface';
const JWT_SECRET = "sfbdfjhbglfdgjbfdgbfdbgljfdfdljgljdf";

export const generateJWT = (user: User): string => {

    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            userName: user.userName,
            
        },
        JWT_SECRET,
        {
            expiresIn: '1h',
        }
    );
}

export const verifyJWT = (token: string): User | null => {
    try {
        const user = jwt.verify(token, JWT_SECRET);
        return user as User;
    } catch (error) {
        return null;
    }
}

export const verifyJWTMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const user = verifyJWT(token);

    if (!user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    req.user = user;
    next();
}


