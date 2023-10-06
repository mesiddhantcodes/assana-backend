"use strict";
// auth.controller.test.ts
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
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const db_1 = require("../utils/db");
jest.mock('../utils/db', () => ({
    getDatabase: jest.fn(),
}));
describe('AuthController', () => {
    //   const mockRequest = {} as Request;
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
            }),
        };
        db_1.getDatabase.mockReturnValue(db);
    });
    // Test cases for login route
    describe('login', () => {
        it('should return 404 when user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'nonexistent@example.com';
            const password = 'password';
            const req = { body: { email, password } };
            yield auth_controller_1.default.login(req, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
        }));
        // Add more test cases for login route as needed
    });
    // Test cases for register route
    describe('register', () => {
        it('should return 201 when a new user is successfully registered', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = {
                name: 'New User',
                email: 'newuser@example.com',
                password: 'password',
                userName: 'newuser',
            };
            const req = { body: newUser };
            yield auth_controller_1.default.register(req, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
        }));
        it('should return 409 when a user with the same email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingUser = {
                name: 'Existing User',
                email: 'existinguser@example.com',
                password: 'password',
                userName: 'existinguser',
            };
            const req = { body: existingUser };
            // Mock the findOne method to simulate an existing user
            const findOneMock = jest.fn().mockReturnValue(existingUser);
            const collection = (0, db_1.getDatabase)().collection();
            collection.findOne = findOneMock;
            yield auth_controller_1.default.register(req, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(409);
        }));
        // Add more test cases for register route as needed
    });
});
