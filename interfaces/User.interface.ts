import { generateId } from "../utils/snowflake";

interface User {
    id:string;
    name:string;
    email:string;
    password:string;
    userName:string;
    projects:string[];
    createdAt:Date;
    updatedAt:Date;
    
}

export const registerUser=(name: string,email: string,password: string,userName: string):User=>{
    return {
        id:generateId(),
        name,
        email,
        password,
        userName,
        projects:[],
        createdAt:new Date(),
        updatedAt:new Date()
    }
}





export default User;