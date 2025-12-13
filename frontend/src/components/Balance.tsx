export function Balance({value}: {value: number}){
    return <div className="flex px-16 text-lg my-5">
        <div className="font-bold">Your balance:</div>
        <div className="font-semibold ml-2">Rs {value}</div>
    </div>
}