"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const snowflake_1 = require("../utils/snowflake");
const registerUser = (name, email, password, userName) => {
    return {
        id: (0, snowflake_1.generateId)(),
        name,
        email,
        password,
        userName,
        projects: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };
};
exports.registerUser = registerUser;
