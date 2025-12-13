import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

export interface UserType {
    _id: string;
    firstName: string;
    lastName: string;
}

export function Users() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [filter, setFilter] = useState("");
    const navigate = useNavigate();
    const debounceValue = useDebounce(filter, 500);

    useEffect(() => {
        if(!debounceValue.trim()) return
        axios
            .get(`${BACKEND_URL}/user/bulk?filter=${debounceValue}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((response) => setUsers(response.data.users))
            .catch((error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        navigate("/signin");
                    }
                }
            });
    }, [debounceValue]);

    return (
        <div className="px-20">
            <div className="font-bold mt-6 text-lg py-1">Users</div>
            <input
                type="text"
                placeholder="Search users..."
                className="w-full px-2 py-1 border border-slate-200 rounded outline-0"
                onChange={(e) => setFilter(e.target.value)}
            />
            <div className="my-2">
                {users.map((user) => (
                    <User user={user} />
                ))}
            </div>
        </div>
    );
}

function User({ user }: { user: UserType }) {
    const navigate = useNavigate();
    return (
        <div className="flex justify-between items-center px-5">
            <div className="flex items-center">
                <Avatar
                    letter={user.firstName[0].toUpperCase()}
                    color="primary"
                />
                <div className="ml-4">
                    {user.firstName} {user.lastName}
                </div>
            </div>
            <div>
                <Button label="Send Money" onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName} ${user.lastName}`)} />
            </div>
        </div>
    );
}
