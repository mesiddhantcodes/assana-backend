"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createColumn = void 0;
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
