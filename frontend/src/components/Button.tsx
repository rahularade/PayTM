interface ButtonProps{
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export function Button({label, onClick}: ButtonProps){
    return <button onClick={onClick} className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg font-bold px-5 py-2">
        {label}
    </button>
}