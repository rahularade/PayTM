import mongoose, { SchemaTypes } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30,
    },
}, {timestamps: true});

const accountSchema = new mongoose.Schema({
    userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true },
}, {timestamps: true});

const transactionSchema = new mongoose.Schema({
    from: { type: SchemaTypes.ObjectId, ref: "User", required: true},
    to: { type: SchemaTypes.ObjectId, ref: "User", required: true},
    amount: { type: Number, required: true },
}, {timestamps: true})

export const User = mongoose.model("User", userSchema);
export const Account = mongoose.model("Account", accountSchema);
export const Transaction = mongoose.model("Transaction", transactionSchema);
