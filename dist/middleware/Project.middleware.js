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
exports.ProjectPermissionMiddleware = void 0;
const db_1 = require("../utils/db");
const ProjectPermissionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let db = (0, db_1.getDatabase)();
    const { projectId } = req.params;
    const userId = req.user.id;
    const UserCollection = db.collection('users');
    const isProjectPresent = yield UserCollection.findOne({ id: userId });
    if (isProjectPresent && !isProjectPresent.projects.includes(projectId)) {
        return res.status(401).json({ message: 'You dont have a access to Project !!!!! ' });
    }
    else {
        next();
    }
});
exports.ProjectPermissionMiddleware = ProjectPermissionMiddleware;
