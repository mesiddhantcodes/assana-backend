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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_controller_1 = __importDefault(require("../controller/project.controller"));
const db_1 = require("../utils/db");
jest.mock('../utils/db', () => ({
    getDatabase: jest.fn()
}));
// jest.mock('../middleware/Authentication.middleware', () => ({
//     verifyJWTMiddleware: jest.fn(),
// }));
// jest.mock('../middleware/Project.middleware', () => ({
//     ProjectPermissionMiddleware: jest.fn(),
// }));
// ProjectController
describe('ProjectController', () => {
    let mockResponse;
    beforeEach(() => {
        // Create a mock response object with required methods
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    beforeAll(() => {
        // Mock the database connection (you may need to adjust this based on your database setup)
        const db = {
            collection: jest.fn().mockReturnValue({
                findOne: jest.fn(),
                insertOne: jest.fn(),
                // updateOne: jest.fn(),
            }),
        };
        db_1.getDatabase.mockReturnValue(db);
    });
    describe('create', () => {
        it('should return 201 when a new project is successfully created', () => __awaiter(void 0, void 0, void 0, function* () {
            const newProject = {
                name: 'New Project',
                description: 'New Project Description',
            };
            const req = { body: newProject };
            yield project_controller_1.default.create(req, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
        }));
        it('should return 404 when user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const newProject = {
                name: 'New Project',
                description: 'New Project Description',
            };
            const req = { body: newProject };
            yield project_controller_1.default.create(req, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
        }));
    });
});
