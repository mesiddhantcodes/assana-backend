"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = void 0;
const snowflake_1 = require("../utils/snowflake");
const createTask = (name, deadline, priority, createdBy, columnId) => {
    return {
        id: (0, snowflake_1.generateId)(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline,
        priority,
        createdBy,
        columnId
    };
};
exports.createTask = createTask;
