import React from "react";

interface CreditInfoProps {
  credits: number;
  isLoading?: boolean;
}

export default function CreditInfo({ credits, isLoading }: CreditInfoProps) {
  return (
    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-blue-700 font-semibold w-fit shadow mb-4">
      {/* SVG bintang kecil, fix ukuran */}
      <svg
        className="w-5 h-5 mr-1 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 1l2.39 4.843 5.34.776-3.868 3.769.913 5.327L10 13.348l-4.775 2.507.913-5.327L2.27 6.619l5.34-.776z"></path>
      </svg>
      {isLoading ? (
        <span>Loading credit...</span>
      ) : (
        <span>{credits} Credit</span>
      )}
    </div>
  );
}
