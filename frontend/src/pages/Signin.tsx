import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { BACKEND_URL } from "../config";
import axios, { AxiosError } from "axios";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

export function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {refreshUser } = useAuth()

    const signin = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/user/signin`, {
                username,
                password,
            });

            localStorage.setItem("token", "Bearer " + response.data.token);
            await refreshUser()
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    alert("Server is down. Please try again later.")
                }
            }
        }
    };

    return (
        <div className="min-h-dvh grid grid-rows-[auto_1fr]">
            <Navbar type={"signin"} />
            <div className="bg-stone-200 w-dvw flex justify-center items-center pb-10">
                <div className="bg-white w-96 text-center h-max py-5 px-8 rounded-lg">
                    <Heading label="Sign In" />
                    <SubHeading label="Enter your credentials to access your account" />
                    <InputBox
                        label="Email"
                        placeholder="john@gmail.com"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <InputBox
                        type="password"
                        label="Password"
                        placeholder="Pass@1234"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button label="Sign In" onClick={signin} />
                    <BottomWarning
                        label="Don't have an account?"
                        buttonText="Sign Up"
                        to="/signup"
                    />
                </div>
            </div>
        </div>
    );
}
