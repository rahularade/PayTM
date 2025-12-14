import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { Users } from "../components/Users";

export function Dashboard(){
    const [balance, setBalance] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${BACKEND_URL}/account/balance`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            setBalance(response.data.balance)
        }).catch(error => {
            if (error instanceof AxiosError) {
                if(error.response?.status === 401){
                    navigate("/signin")
                } else {
                    alert("Server is down. Please try again later.")
                    navigate("/")
                }
            }
        })
    }, [])

    return <div className="w-full">
        <Appbar/>
        <div>
            <Balance value={balance}/>
            <Users />
        </div>
    </div>
}