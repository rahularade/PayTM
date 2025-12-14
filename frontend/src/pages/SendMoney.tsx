import { useNavigate, useSearchParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { useState, type ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";

export function SendMoney() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState("");
    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        value = value.replaceAll(/[^0-9.]/g, "");
        if (value === ".") {
            value = "0.";
        }

        const parts = value.split(".");

        if (parts[1]?.length > 2) {
            value = parts[0] + "." + parts[1].slice(0, 2);
        }

        if (parts.length > 2) {
            value = parts[0] + "." + parts.slice(1).join("");
        }

        setAmount(value);
    };

    const handleTransfer = async () => {
        if (Number(amount) < 0) {
            alert("Invalid Amount")
            return
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/account/transfer`, {
                amount: Number(amount),
                to: id
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })

            alert(response.data.message)
            navigate("/dashboard")
        } catch (error) {
            if(error instanceof AxiosError){
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    alert("Server is down. Please try again later.")
                }
            }
        }
    }

    return (
        <div className="min-h-dvh grid grid-rows-[auto_1fr_auto]">
        <Appbar />
        <div className="w-dvw flex justify-center pb-20 items-center bg-gray-50">
            <div className="h-min w-96 p-8 rounded-lg shadow-lg bg-white text-center">
                <h2 className="text-3xl font-bold pb-4">Send Money</h2>
                <div className="flex items-center space-x-2">
                    <Avatar letter="U" color="secondary" />
                    <h3 className="text-2xl font-semibold">{name}</h3>
                </div>
                <div>
                    <div className="text-sm font-medium text-left py-2">
                        Amount (in Rs)
                    </div>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={amount}
                        min={0}
                        placeholder="Enter amount"
                        onChange={handleChange}
                        className="w-full px-2 py-1 border border-slate-200 rounded outline-0"
                    />
                </div>
                <button className="justify-center mt-4 rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white" onClick={handleTransfer}>
                    Initiate Transfer
                </button>
            </div>
            </div>
            <Footer />
        </div>
    );
}
