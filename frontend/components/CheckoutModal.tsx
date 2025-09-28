import React from "react";

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  onCheckout: (amount: number) => void;
  isProcessing?: boolean;
};

const amounts = [5000, 10000, 20000, 50000]; // Bisa diganti sesuai kebutuhan

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  onCheckout,
  isProcessing = false,
}) => {
  const [selected, setSelected] = React.useState<number>(amounts[0]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all">
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-fade-in">
        {/* Close */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          disabled={isProcessing}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-3 text-blue-700 text-center">
          Top Up Credit
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Pilih jumlah credit yang ingin kamu beli.  
          <br />
          <span className="text-xs">1 credit = 1.000 Rupiah</span>
        </p>

        <div className="flex flex-col gap-3 mb-5">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setSelected(amt)}
              disabled={isProcessing}
              className={`border-2 rounded-xl py-2 font-semibold ${
                selected === amt
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
              }`}
            >
              {amt.toLocaleString("id-ID")} Credit ({(amt / 1000).toLocaleString("id-ID", {style:"currency",currency:"IDR"})})
            </button>
          ))}
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-bold transition mb-1"
          onClick={() => onCheckout(selected)}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Bayar Sekarang"}
        </button>

        <p className="text-center text-gray-400 text-xs mt-2">
          Powered by Xendit / QRIS
        </p>
      </div>
      {/* Simple animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default CheckoutModal;
