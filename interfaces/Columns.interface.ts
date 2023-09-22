import { generateId } from "../utils/snowflake";

interface Columns{
    id:string;
    name:string;
    createdAt:Date;
    updatedAt:Date;
    projectId:string;
}

export const createColumn = (projectId:string,name:string):Columns=>{
    return {
        id:generateId(),
        name:name,
        createdAt:new Date(),
        updatedAt:new Date(),
        projectId
    }
}


export default Columns;