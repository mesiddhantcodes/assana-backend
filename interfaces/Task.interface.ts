import { getDatabase } from "../utils/db";
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
    assignedTo:string[];
    
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
        columnId,
        assignedTo:[]

    }
}

export const moveTaskById = async (initialColumnId: string, targetColumnId: string, taskId: string) => {
    const db = getDatabase();
    const ColumnCollection = db.collection('columns');
    const initialColumn = await ColumnCollection.findOne({ id: initialColumnId });
    const targetColumn = await ColumnCollection.findOne({ id: targetColumnId });
    if (!initialColumn) {
        return {
            message: 'Initial column not found',
            success: false
        };
    }
    if (!targetColumn) {
        return {
            message: 'Target column not found',
            success: false
        };
    }
    // pop taskid from initial column
    await ColumnCollection.updateOne(
        { id: initialColumnId },
        {
            $pull:
            {
                tasks: taskId
            }
        });
    // push taskid to target column
    await ColumnCollection.updateOne(
        { id: targetColumnId },
        {
            $push:
            {
                tasks: taskId
            }
        });

    return {
        message: 'Task moved',
        success: true
    };


}
export default Task;
