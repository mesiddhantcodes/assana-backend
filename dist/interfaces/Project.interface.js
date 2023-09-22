"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const snowflake_1 = require("../utils/snowflake");
const createProject = (name, description, createdBy) => {
    return {
        id: (0, snowflake_1.generateId)(),
        name,
        description,
        // tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy,
        columns: []
    };
};
exports.createProject = createProject;
