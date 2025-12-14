import express from "express";
import z from "zod";
import { Account, User } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import auth from "../middleware";

const userRouter = express.Router();
const signupBody = z.object({
    firstName: z
    .string()
    .trim()
    .min(3, "Firstname must be at least 3 characters")
    .max(30, "Firstname must be less than 30 characters"),
    lastName: z
    .string()
    .trim()
    .min(3, "Lastname must be at least 3 characters")
    .max(30, "Lastname must be less than 30 characters"),
    username: z.email("Invalid email address").trim().toLowerCase(),
    password: z
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

userRouter.post("/signup", async (req, res) => {
    try {
        const parsedData = signupBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues[0].message,
            });
        }

        const { username, password, firstName, lastName } = parsedData.data;
        const existingUser = await User.findOne({ username }).lean().exec();

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exist",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 9);
        const user = await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
        });

        await Account.create({
            userId: user._id,
            balance: 1 + Math.floor(Math.random() * 100000)
        })

        res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Sign up failed. Try again later.",
        });
    }
});

userRouter.post("/signin", async (req, res) => {
    try {
        const parsedData = signinBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues[0].message,
            });
        }

        const { username, password } = parsedData.data;
        const user = await User.findOne({ username }).lean().exec();

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            message: "Signed in successful",
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Sign in failed. Try again later.",
        });
    }
});

userRouter.put("/", auth, async (req, res) => {
    try {
        const parsedData = updateBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues[0].message,
            });
        }

        const { password, firstName, lastName } = parsedData.data;
        const hashedPassword = await bcrypt.hash(password, 9);

        const result = await User.updateOne(
            { _id: req.userId },
            {
                firstName,
                lastName,
                password: hashedPassword,
            }
        );

        if (!result.modifiedCount) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(201).json({
            message: "User updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "User update failed. Try again later.",
        });
    }
});

userRouter.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("_id username firstName lastName")
            .lean()
            .exec();
    
        res.status(200).json({
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user. Try again later."
        });
    }
});

userRouter.get("/bulk", auth, async (req, res) => {
    try {
        const filter = (req.query.filter as string) || "";
        const users = await User.find()
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
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users. Try again later."
        });
    }
});

export default userRouter;
