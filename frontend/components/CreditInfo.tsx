import React from "react";

interface CreditInfoProps {
  credits: number;
  isLoading?: boolean;
}

export default function CreditInfo({ credits, isLoading }: CreditInfoProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-blue-700 font-semibold w-fit shadow mb-4 text-sm">
      {isLoading ? "Loading credit..." : `${credits} Credit`}
    </div>
  );
}
