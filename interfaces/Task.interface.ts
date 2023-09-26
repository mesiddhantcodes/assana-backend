import { generateId } from "../utils/snowflake";
interface Task {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deadline: Date;
    priority: string;
    createdBy:string;
    columnId:string;
    
}

export const createTask = (name: string, deadline: Date, priority: string, createdBy:string,columnId:string): Task => {
    return {
        id: generateId(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline,
        priority,
        createdBy,
        columnId
    }
}

export default Task;
