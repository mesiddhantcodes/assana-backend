"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveColumnById = exports.createColumn = void 0;
const db_1 = require("../utils/db");
const snowflake_1 = require("../utils/snowflake");
const createColumn = (projectId, name) => {
    return {
        id: (0, snowflake_1.generateId)(),
        name: name,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId,
        tasks: []
    };
};
exports.createColumn = createColumn;
const moveColumnById = (initialColumnId, targetColumnId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, db_1.getDatabase)();
    const ColumnCollection = db.collection('columns');
    const initialColumn = yield ColumnCollection.findOne({ id: initialColumnId });
    const targetColumn = yield ColumnCollection.findOne({ id: targetColumnId });
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
    const intialColumnAt = yield ColumnCollection.updateOne({ id: initialColumnId }, { $set: { updatedAt: targetColumnUpdatedAt } });
    const targetColumnAt = yield ColumnCollection.updateOne({ id: targetColumnId }, { $set: { updatedBy: intialColumnUpdatedAt } });
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
});
exports.moveColumnById = moveColumnById;
