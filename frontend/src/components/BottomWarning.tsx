import { Link } from "react-router-dom"

interface BottomWarningProps{
    label: string;
    buttonText: string;
    to: string
}


export function BottomWarning({label, buttonText, to}: BottomWarningProps){
    return <div className="flex justify-center py-2 text-sm">
        <div>{label}</div>
        <Link className="cursor-pointer underline pl-1" to={to}>{buttonText}</Link>
    </div>
}