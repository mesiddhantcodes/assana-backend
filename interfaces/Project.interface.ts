import { generateId } from "../utils/snowflake";

interface Project {
    id: string;
    name: string;
    description: string;
    // tasks: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    columns: string[];
}

export const createProject = (name: string, description: string, createdBy: string): Project => {
    return {
        id: generateId(),
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy,
        columns: [] 
    }
}

export default Project;
