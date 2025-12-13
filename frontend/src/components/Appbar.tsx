import { Avatar } from "./Avatar";

export function Appbar(){
    return <div className="h-14 flex justify-between items-center px-16 py-1 shadow">
        <div className="text-lg">
            PayTM App
        </div>
        <div className="flex items-center">
            <div className="text-base mr-4">
                Hello
            </div>
            <Avatar letter="U" color="primary"/>
        </div>
    </div>
}