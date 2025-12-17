import express from "express";
import { Account, Transaction } from "../db";
import auth from "../middlewares/auth";
import { startSession } from "mongoose";
import z from "zod";

const accountRouter = express.Router();
const amountSchema = z
    .number("Amount must be a number")
    .gt(0, "Amount must be greater than 0");

accountRouter.get("/balance", auth, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        if (!account) {
            return res.status(404).json({
                message: "Balance not found",
            });
        }

        res.status(200).json({
            balance: account.balance / 100,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch balance. Try again later.",
        });
    }
});

accountRouter.post("/transfer", auth, async (req, res) => {
    const session = await startSession();

    try {
        session.startTransaction();
        const { amount, to } = req.body;
        if (req.userId === to) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "You cannot send money to your own account",
            });
        }

        const parsedData = amountSchema.safeParse(amount);

        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues[0].message,
            });
        }

        const parsedAmount = Number(parsedData.data.toFixed(2)) * 100;

        const toAccount = await Account.findOne({ userId: to }).session(
            session
        );
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account",
            });
        }

        const account = await Account.findOne({ userId: req.userId }).session(
            session
        );
        if (!account || account.balance < parsedAmount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -parsedAmount } }
        ).session(session);
        await Account.updateOne(
            { userId: to },
            { $inc: { balance: parsedAmount } }
        ).session(session);

        await Transaction.create(
            [
                {
                    from: req.userId,
                    to,
                    amount: parsedAmount / 100,
                },
            ],
            { session }
        );

        await session.commitTransaction();

        res.status(200).json({
            message: "Transfer successful",
        });
    } catch (error) {
        session.abortTransaction();
        res.status(500).json({
            message: "Failed to transfer. Try again later.",
        });
    }
});

accountRouter.get("/transactions", auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;
        const filter = {
            $or: [{ from: req.userId }, { to: req.userId }],
        };

        const total = await Transaction.countDocuments(filter);

        if (skip >= total && total !== 0) {
            return res.status(400).json({
                message: "Invalid page number or limit",
            });
        }

        const transactions = await Transaction.find(filter)
            .populate("from", "_id firstName lastName")
            .populate("to", "_id firstName lastName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            total,
            page,
            limit,
            count: transactions.length,
            transactions,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions. Try again later.",
        });
    }
});

export default accountRouter;
