import { Check } from "./Check";

interface Props {
    open: boolean;
    amount: string;
    name: string | null;
    onClose: () => void;
}

export function TransferSuccessModal({ open, amount, name, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white p-10 rounded-xl shadow-xl w-11/12 md:w-96 h-min text-center animate-scaleIn">
            
                <Check />
                <h2 className="text-2xl font-bold mt-3">
                    Transfer Successful
                </h2>

                <p className="text-gray-600 mt-2 font-semibold">
                    ₹{Number(amount).toFixed(2)} sent to
                </p>

                <p className="font-bold text-lg mt-1">{name}</p>

                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition"
                >
                    Done
                </button>
            </div>
        </div>
    );
}
