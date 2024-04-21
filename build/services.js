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
const axios_1 = __importDefault(require("axios"));
class APISerives {
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.post('https://b2b.topsports.ru/api/login', {
                username,
                password
            });
            return result.data;
        });
    }
    static fetchData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get('https://b2b.topsports.ru/api/catalog', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(result.data);
            return result.data;
        });
    }
}
exports.default = APISerives;
