import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import type { UserType } from "./Users";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Github } from "./Github";

export function Appbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div
            ref={ref}
            className="flex items-center text-gray-900 justify-between px-5 py-2 md:px-20 md:py-3 border-b-2 border-black bg-white sticky top-0 z-50"
        >
            <div
                className="text-2xl font-black cursor-pointer"
                onClick={() => navigate("/dashboard")}
            >
                PAYTM.
            </div>
            <div className="flex items-center gap-2">
                <Github />
                <div className="text-base font-semibold">
                    Hello, {user?.firstName}
                </div>
                <div onClick={() => setOpen((prev) => !prev)}>
                    <Avatar
                        letter={user?.firstName[0] || "U"}
                        color="primary"
                    />
                </div>
            </div>
            {open && <Accordion user={user!} />}
        </div>
    );
}

function Accordion({ user }: { user: UserType }) {
    const { setUser } = useAuth();
    return (
        <div className="absolute right-5 top-16 md:right-20 md:top-18 w-40 bg-white border border-slate-200 rounded shadow-md font-semibold">
            <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {user?.firstName} {user?.lastName}
                </li>
                <li
                    onClick={() => {
                        localStorage.removeItem("token");
                        setUser(null);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                >
                    Logout
                </li>
            </ul>
        </div>
    );
}
