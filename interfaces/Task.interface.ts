import { generateId } from "../utils/snowflake";
interface Task {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deadline: Date;
    priority: string;
    projectId: string;
}

export const createTask = (name: string, deadline: Date, priority: string, projectId: string): Task => {
    return {
        id: generateId(),
        name,

        createdAt: new Date(),
        updatedAt: new Date(),
        deadline,
        priority,
        projectId
    }
}

export default Task;
