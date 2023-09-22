import express from 'express';
import { connectToDatabase } from './utils/db';
import ProjectRouter from './routes/project.router';
import TaskController from './routes/task.router';
const swaggerUi=require('swagger-ui-express');
const swaggerDocument=require('../swagger_output.json');
const cors=require('cors');
const app = express();
const port = 3000;

connectToDatabase();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/Project', ProjectRouter);
app.use('/Task', TaskController);
app.use('/swagger',swaggerUi.serve,swaggerUi.setup(swaggerDocument) );
app.get('/', (req, res) => {
    res.send('Hello, Express.js with TypeScript!');
});

app.listen(port,'0.0.0.0',() => {
    console.log(`Server is running on port ${port}`);
});

