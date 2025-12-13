import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios, { AxiosError } from "axios";

export function Signin(){
    const [username, setUsername] =useState("");
    const [password, setPassword] =useState("");
    const navigate = useNavigate()

    const signin = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/user/signin`, {
                username,
                password
            })

            localStorage.setItem("token", "Bearer " + response.data.token)
            navigate("/dashboard")
            
        } catch (error) {
            if(error instanceof AxiosError){
                alert(error.response?.data.message)
            }
        }
        
    }

    return <div className="bg-stone-200 h-dvh w-dvw flex justify-center items-center">
        <div className="bg-white w-96 text-center h-max py-5 px-8 rounded-lg">
            <Heading label="Sign In"/>
            <SubHeading label="Enter your credentials to access your account"/>
            <InputBox label="Email" placeholder="john@gmail.com" onChange={(e) => {setUsername(e.target.value)}}/>
            <InputBox type="password" label="Password" placeholder="Pass@1234" onChange={(e) => {setPassword(e.target.value)}}/>
            <Button label="Sign In" onClick={signin}/>
            <BottomWarning label="Don't have an account?" buttonText="Sign Up" to="/signup"/>
        </div>
    </div>
}