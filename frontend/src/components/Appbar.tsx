import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import type { UserType } from "./Users";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Appbar() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<UserType>();
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/user/`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((response) => setUser(response.data.user))
            .catch((error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        navigate("/signin");
                    }
                }
            });
    }, []);

    return (
        <div className="h-14 flex justify-between items-center px-16 py-1 shadow">
            <div className="text-lg">PayTM App</div>
            <div className="flex items-center">
                <div className="text-base mr-4">Hello, {user?.firstName}</div>
                <div onClick={() => setOpen(prev => !prev)}>
                    <Avatar letter={user?.firstName[0] || "U"} color="primary" />
                </div>
            </div>
            {open && <Accordion user={user!}/>}
        </div>
    );
}

function Accordion({ user }: { user: UserType }) {
    const navigate = useNavigate();
    return (
        <div className="absolute right-3 top-16 w-40 bg-white border border-slate-200 rounded shadow-md">
            <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {user?.firstName} {user?.lastName}
                </li>
                <li onClick={() => {
                    localStorage.removeItem("token")
                    navigate("/signin")
                }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                    Logout
                </li>
            </ul>
        </div>
    );
}
