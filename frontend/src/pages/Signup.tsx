import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup(){
    const [firstName, setFirstName] =useState("");
    const [lastName, setLastName] =useState("");
    const [username, setUsername] =useState("");
    const [password, setPassword] =useState("");
    const navigate = useNavigate()

    const signup = async () => {
        try {
            await axios.post(`${BACKEND_URL}/user/signup`, {
                firstName,
                lastName,
                username,
                password
            })

            navigate("/signin")
            
        } catch (error) {
            if(error instanceof AxiosError){
                alert(error.response?.data.message)
            }
        }
        
    }

    return <div className="bg-stone-200 w-dvw h-dvh flex justify-center items-center">
        <div className="bg-white w-96 text-center h-max py-5 px-8 rounded-lg">
            <Heading label="Sign Up"/>
            <SubHeading label="Enter your infromation to create an account"/>
            <InputBox label="First Name" placeholder="John" onChange={(e) => {setFirstName(e.target.value)}}/>
            <InputBox label="Last Name" placeholder="Doe" onChange={(e) => {setLastName(e.target.value)}}/>
            <InputBox label="Email" placeholder="john@gmail.com" onChange={(e) => {setUsername(e.target.value)}}/>
            <InputBox type="password" label="Password" placeholder="Pass@1234" onChange={(e) => {setPassword(e.target.value)}}/>
            <Button label="Sign Up" onClick={signup}/>
            <BottomWarning label="Already have an account?" buttonText="Sign In" to="/signin"/>
        </div>
    </div>
}