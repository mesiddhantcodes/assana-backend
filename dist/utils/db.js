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
exports.getDatabase = exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
// const db=new MongoClient("mongodb+srv://assnaAdmin:Asna123@cluster0.phbuxbe.mongodb.net/assna-clone?retryWrites=true&w=majority");
const db = new mongodb_1.MongoClient("mongodb://0.0.0.0:27017/asana-clone");
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.connect();
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.log(err);
    }
});
exports.connectToDatabase = connectToDatabase;
const getDatabase = () => {
    return db.db("asana-clone");
};
exports.getDatabase = getDatabase;
exports.default = db;
