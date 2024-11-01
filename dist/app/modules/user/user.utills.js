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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUtills = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const user_model_1 = require("./user.model");
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const hashPassword = (password) => {
    // Generate a salt synchronously
    const saltRounds = parseInt(config_1.default.bcrypt.salt_rounds) || 12;
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    // Hash the password synchronously
    return bcrypt_1.default.hashSync(password, salt);
};
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = userData, otherData = __rest(userData, ["password"]);
    // Hash the password synchronously
    const hashedPassword = hashPassword(password);
    const result = yield user_model_1.User.create(Object.assign(Object.assign({}, otherData), { password: hashedPassword }));
    const _a = result.toObject(), { password: createdPass } = _a, dataWithoutPassword = __rest(_a, ["password"]);
    return dataWithoutPassword;
});
const createTokenRefreshTokenForUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // creating access token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(payload, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // creating refresh token
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(payload, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return { accessToken, refreshToken };
});
exports.UserUtills = {
    createUser,
    createTokenRefreshTokenForUser,
    hashPassword,
};
