// auth.controller.test.ts

import { Request, Response } from 'express';

import AuthController from '../controller/auth.controller';
import { getDatabase } from '../utils/db';

jest.mock('../utils/db', () => ({
    getDatabase: jest.fn(),
}));

describe('AuthController', () => {
    //   const mockRequest = {} as Request;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        // Create a mock response object with required methods
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as Partial<Response>;
    });

    beforeAll(() => {
        // Mock the database connection (you may need to adjust this based on your database setup)
        const db = {
            collection: jest.fn().mockReturnValue({
                findOne: jest.fn(),
                insertOne: jest.fn(),
            }),
        };
        (getDatabase as jest.Mock).mockReturnValue(db);
    });

    // Test cases for login route
    describe('login', () => {
        it('should return 404 when user does not exist', async () => {
            const email = 'nonexistent@example.com';
            const password = 'password';
            const req = { body: { email, password } } as Request;

            await AuthController.login(req, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
        });

        // Add more test cases for login route as needed
    });

    // Test cases for register route
    describe('register', () => {
        it('should return 201 when a new user is successfully registered', async () => {
            const newUser = {
                name: 'New User',
                email: 'newuser@example.com',
                password: 'password',
                userName: 'newuser',
            };
            const req = { body: newUser } as Request;
            await AuthController.register(req, mockResponse as Response);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });

        it('should return 409 when a user with the same email already exists', async () => {
            const existingUser = {
                name: 'Existing User',
                email: 'existinguser@example.com',
                password: 'password',
                userName: 'existinguser',
            };
            const req = { body: existingUser } as Request;
            // Mock the findOne method to simulate an existing user
            const findOneMock = jest.fn().mockReturnValue(existingUser);
            const collection = (getDatabase() as any).collection();
            collection.findOne = findOneMock;
            await AuthController.register(req, mockResponse as Response);
            expect(mockResponse.status).toHaveBeenCalledWith(409);
        });

        // Add more test cases for register route as needed
    });
});
