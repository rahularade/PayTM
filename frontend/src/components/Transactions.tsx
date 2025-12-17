import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import type { UserType } from "./Users";
import { useAuth } from "../contexts/AuthContext";
import { Sent } from "../icons/Sent";
import { Received } from "../icons/Received";
import { Avatar } from "./Avatar";
import { Previous } from "../icons/Previous";
import { Next } from "../icons/Next";

interface TransactionType {
    _id: string;
    from: UserType;
    to: UserType;
    amount: number;
    createdAt: string;
}

export function Transactions() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const limit = 10;

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/account/transactions?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            if (total !== response.data.total) {
                setTotal(response.data.total);
            }
            setTransactions(response.data.transactions);
        } catch (error) {
            if (error instanceof AxiosError) {
                alert(error.response?.data.message);
            }
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const totalPages = Math.ceil(total / limit);
    return (
        <div className="px-5 md:px-20">
            <div className="font-bold mt-6 text-xl py-1">
                Transaction Histroy
            </div>
            <div>
                {transactions.length > 0 &&
                    transactions.map((transaction) => (
                        <Transaction
                            key={transaction._id}
                            transaction={transaction}
                        />
                    ))}
            </div>
            <div className="flex items-center justify-center gap-0.5 my-4 flex-wrap">
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded border-[1.5px] border-gray-900 hover:bg-gray-900 hover:text-white transition-all ${
                        page <= 1 ? "opacity-0" : ""
                    }`}
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    <Previous />
                </button>
                {Array(totalPages)
                    .fill(0)
                    .map((_, i) => (
                        <button
                            key={i}
                            className={`w-8 h-8 flex items-center justify-center rounded border-[1.5px] border-gray-900 text-lg hover:bg-gray-900 hover:text-white transition-all ${
                                page === i + 1 ? "bg-gray-900 text-white" : ""
                            }`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded border-[1.5px] border-gray-900 hover:bg-gray-900 hover:text-white ${
                        page >= totalPages ? "opacity-0" : ""
                    } transition-all`}
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    <Next />
                </button>
            </div>
        </div>
    );
}

function Transaction({ transaction }: { transaction: TransactionType }) {
    const { user } = useAuth();
    const isSend = transaction.from._id === user?._id;
    let name: string;
    if (isSend) {
        name = `${transaction.to.firstName} ${transaction.to.lastName}`;
    } else {
        name = `${transaction.from.firstName} ${transaction.from.lastName}`;
    }

    return (
        <div className="px-2 md:px-5 py-2 rounded border border-slate-100 flex justify-between items-center">
            <div className="flex gap-2 items-center">
                <Avatar letter={name[0]} color="primary" />
                <div>
                    <div className="font-semibold">{name}</div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                        TID: {transaction._id}
                    </p>
                    <p className="text-xs text-gray-600">
                        {new Date(transaction.createdAt)
                            .toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            }).toString().trim()}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                {isSend ? <Sent /> : <Received />}
                <div className="tabular-nums font-semibold">
                    {transaction.amount.toFixed(2)}
                </div>
            </div>
        </div>
    );
}
