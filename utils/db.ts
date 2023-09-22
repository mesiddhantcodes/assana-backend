import { MongoClient } from "mongodb";


const db=new MongoClient("mongodb+srv://assnaAdmin:Asna123@cluster0.phbuxbe.mongodb.net/assna-clone?retryWrites=true&w=majority");

export const connectToDatabase=async()=>{
    try{
        await db.connect();
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.log(err);
    }
}
export const getDatabase=()=>{
    return db.db("asana-clone");
}
export default db;
