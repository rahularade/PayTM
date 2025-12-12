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
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const middleware_1 = __importDefault(require("../middleware"));
const userRouter = express_1.default.Router();
const signupBody = zod_1.default.object({
    firstName: zod_1.default
        .string()
        .trim()
        .min(3, "Firstname must be at least 3 characters")
        .max(30, "Firstname must be less than 30 characters"),
    lastName: zod_1.default
        .string()
        .trim()
        .min(3, "Lastname must be at least 3 characters")
        .max(30, "Lastname must be less than 30 characters"),
    username: zod_1.default.email("Invalid email address").trim().toLowerCase(),
    password: zod_1.default
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(30, "Password must be less than 30 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});
const signinBody = signupBody.pick({
    username: true,
    password: true,
});
const updateBody = signupBody.pick({
    firstName: true,
    lastName: true,
    password: true,
});
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = signupBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues[0].message,
            });
        }
        const { username, password, firstName, lastName } = parsedData.data;
        const existingUser = yield db_1.User.findOne({ username }).lean().exec();
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exist",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 9);
        const user = yield db_1.User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
        });
        yield db_1.Account.create({
            userId: user._id,
            balance: 1 + Math.floor(Math.random() * 100000)
        });
        res.status(201).json({
            message: "User created successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Sign up failed. Try again later.",
        });
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = signinBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues[0].message,
            });
        }
        const { username, password } = parsedData.data;
        const user = yield db_1.User.findOne({ username }).lean().exec();
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({
            message: "Signed in successful",
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Sign in failed. Try again later.",
        });
    }
}));
userRouter.put("/", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = updateBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues[0].message,
            });
        }
        const { password, firstName, lastName } = parsedData.data;
        const hashedPassword = yield bcrypt_1.default.hash(password, 9);
        const result = yield db_1.User.updateOne({ _id: req.userId }, {
            firstName,
            lastName,
            password: hashedPassword,
        });
        if (!result.modifiedCount) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(201).json({
            message: "User updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "User update failed. Try again later.",
        });
    }
}));
userRouter.get("/", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.User.findById(req.userId)
            .select("_id username firstName lastName")
            .lean()
            .exec();
        res.status(200).json({
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch user. Try again later."
        });
    }
}));
userRouter.get("/bulk", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter || "";
        const users = yield db_1.User.find()
            .or([
            {
                firstName: {
                    $regex: filter,
                    $options: "i"
                },
            },
            {
                lastName: {
                    $regex: filter,
                    $options: "i"
                },
            },
        ])
            .select("_id username firstName lastName")
            .lean()
            .exec();
        res.status(200).json({
            users: users.filter(user => String(user._id) !== req.userId),
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch users. Try again later."
        });
    }
}));
exports.default = userRouter;
