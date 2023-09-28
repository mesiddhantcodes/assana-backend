import { getDatabase } from "../utils/db";
import { generateId } from "../utils/snowflake";

interface Columns {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    tasks: string[];
}

export const createColumn = (projectId: string, name: string): Columns => {
    return {
        id: generateId(),
        name: name,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId,
        tasks: []
    }
}



export const moveColumnById = async (initialColumnId: number, targetColumnId: number) => {
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
    const intialColumnUpdatedAt = initialColumn.updatedAt;
    const targetColumnUpdatedAt = targetColumn.updatedAt;
    // swap the updatedBy field
    const intialColumnAt = await ColumnCollection.updateOne({ id: initialColumnId }, { $set: { updatedAt: targetColumnUpdatedAt } });
    const targetColumnAt = await ColumnCollection.updateOne({ id: targetColumnId }, { $set: { updatedBy: intialColumnUpdatedAt } });
    if (!intialColumnAt || !targetColumnAt) {
        return {
            message: 'Column not updated',
            success: false
        };
    }
    return {
        message: 'Task moved',
        success: true
    };


}


export default Columns;