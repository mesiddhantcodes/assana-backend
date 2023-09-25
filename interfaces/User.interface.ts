import { generateId } from "../utils/snowflake";

interface User {
    id:string;
    name:string;
    email:string;
    password:string;
    username:string;
    projects:string[];
    createdAt:Date;
    updatedAt:Date;
    
}

export const registerUser=(username:string,email:string,password:string,name:string):User=>{
    return {
        id:generateId(),
        name,
        email,
        password,
        username,
        projects:[],
        createdAt:new Date(),
        updatedAt:new Date()
    }
}

export default User;