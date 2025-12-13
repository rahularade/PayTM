export function Avatar({letter, color}: {letter: string, color: "primary" | "secondary"}) {
    return <div className={`rounded-full h-12 w-12 flex items-center justify-center ${color === "primary" ? "bg-slate-200" : "bg-green-500 text-white"}`}>
        <div className="text-xl">{letter}</div>
    </div>
}