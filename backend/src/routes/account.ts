import express from "express";
import { Account } from "../db";
import auth from "../middlewares/auth";
import { startSession } from "mongoose";
import z from "zod";

const accountRouter = express.Router();
const amountSchema = z
  .number("Amount must be a number")
  .gt(0, "Amount must be greater than 0")
  .refine(
    (val) => Number.isFinite(val) && Math.round(val * 100) === val * 100,
    {
      message: "Amount must have at most 2 decimal places",
    }
  );

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
            messsage: "Failed to fetch balance. Try again later.",
        });
    }
});

accountRouter.post("/transfer", auth, async (req, res) => {
    const session = await startSession();

    try {
        session.startTransaction();
        const { amount, to } = req.body;
        const parsedData = amountSchema.safeParse(amount)

        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues[0].message,
            });
        }

        const parsedAmount = parsedData.data * 100

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
        if (!account || account.balance < amount) {
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

export default accountRouter;
