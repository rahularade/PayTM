import { useNavigate } from "react-router-dom";

export const Navbar = ({
    type = null,
}: {
    type?: "signin" | "signup" | null;
}) => {
    const navigate = useNavigate();

    return (
        <nav className="flex items-center text-gray-900 justify-between px-6 py-3 border-b-2 border-black bg-white sticky top-0 z-50">
            <div
                className="text-2xl font-black cursor-pointer"
                onClick={() => navigate("/")}
            >
                PAYTM.
            </div>
            <div className="flex gap-4 items-">
                <button
                    onClick={() => navigate("/signin")}
                    className={`px-4 py-2 font-bold text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-100 transition-colors rounded ${
                        type === "signin" ? "hidden" : "visible"
                    }`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => navigate("/signup")}
                    className={`px-4 py-2 font-bold text-white bg-gray-800 border-2 border-black hover:bg-gray-900 transition-colors rounded ${
                        type === "signup" ? "hidden" : "visible"
                    }`}
                >
                    Sign Up
                </button>
            </div>
        </nav>
    );
};
