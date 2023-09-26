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
const User_interface_1 = require("../interfaces/User.interface");
const db_1 = require("../utils/db");
const Authentication_middleware_1 = require("../middleware/Authentication.middleware");
const bcrypt_1 = require("../utils/bcrypt");
const AuthController = {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const db = (0, db_1.getDatabase)();
            const userCollection = db.collection('users');
            const userExists = yield userCollection.findOne({ email: user.email });
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }
            const password = user.password;
            if (!(yield (0, bcrypt_1.comparePassword)(password, userExists.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            user.id = userExists.id;
            user.name = userExists.name;
            user.userName = userExists.userName;
            user.email = userExists.email;
            const AccessToken = (0, Authentication_middleware_1.generateJWT)(user);
            res.status(200).json({
                status: true,
                content: {
                    data: {
                        id: userExists.id,
                        name: userExists.name,
                        email: userExists.email,
                        userName: userExists.userName,
                    },
                    meta: {
                        AccessToken,
                    }
                }
            });
            ;
        });
    },
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, userName } = req.body;
                var user_ = (0, User_interface_1.registerUser)(name, email, password, userName);
                const db = (0, db_1.getDatabase)();
                const userCollection = db.collection('users');
                const userExists = yield userCollection.findOne({ email: email });
                if (userExists) {
                    return res.status(409).json({ message: 'User already exists' });
                }
                const userNameTaken = yield userCollection.findOne({ userName: userName });
                if (userNameTaken) {
                    return res.status(409).json({ message: 'Username already taken' });
                }
                const password_ = password;
                user_.password = yield (0, bcrypt_1.encryptPassword)(password_);
                yield userCollection.insertOne(user_);
                return res.status(201).json({ message: 'User created' });
            }
            catch (error) {
                // console.error(error);
                // console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
};
exports.default = AuthController;
