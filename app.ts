import express from 'express';
import { connectToDatabase } from './utils/db';
import ProjectRouter from './routes/project.router';
import TaskRouter from './routes/task.router';
import AuthRouter from './routes/auth.router';
import {serve,setup} from 'swagger-ui-express';




const cors = require('cors');   
// import cors from 'cors';

const app = express();
const port = 3000;

connectToDatabase();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/project', ProjectRouter);
app.use('/task', TaskRouter );
app.use('/auth',AuthRouter);
app.use('/swagger',serve,setup(require('../swagger_output.json')) );
app.get('/', (req, res) => {
    res.send('Hello, Express.js with TypeScript!');
});

app.listen(port,'0.0.0.0',() => {
    console.log(`Server is running on port ${port}`);
});

