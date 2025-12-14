import { useNavigate } from "react-router-dom";

export function Hero() {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[95vh] text-center px-4 bg-white">
      <h1 className="text-6xl md:text-8xl text-gray-900 font-black mb-6">
        SEND CASH.<br />
        <span className="text-gray-400">FAKE CASH.</span>
      </h1>
      <p className="text-xl md:text-2xl font-medium max-w-2xl mb-10 border-l-4 border-black pl-4 text-left">
        The simplest peer-to-peer wallet simulation. Experience the thrill of transactions without losing a single rupee.
      </p>
      
      <button 
        onClick={() => navigate('/signup')}
        className="group flex items-center gap-2 px-8 py-4 text-xl font-bold rounded-md text-white bg-gray-900 border-2 border-gray-900 hover:bg-white hover:text-black transition-all"
      >
        Create Free Wallet
      </button>
    </div>
  );
}