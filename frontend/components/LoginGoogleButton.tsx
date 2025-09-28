import React from "react";

type LoginGoogleButtonProps = {
  onClick?: () => void;
  isLoading?: boolean;
};

const LoginGoogleButton: React.FC<LoginGoogleButtonProps> = ({ onClick, isLoading = false }) => {
  return (
    <button
      type="button"
      className="flex items-center gap-3 w-full justify-center bg-white border border-gray-200 hover:shadow-lg text-gray-700 font-semibold rounded-xl py-2 px-4 mb-3 transition active:scale-95 disabled:opacity-60"
      onClick={onClick}
      disabled={isLoading}
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <g>
          <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C34.7 32 30 35.5 24 35.5c-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.7 4.6 29.6 2.5 24 2.5 12.7 2.5 3.5 11.7 3.5 23S12.7 43.5 24 43.5c11.3 0 20.5-9.2 20.5-20.5 0-1.4-.2-2.8-.4-4z"/>
          <path fill="#34A853" d="M6.3 14.6l6.6 4.8C14.4 16.3 18.8 13.5 24 13.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.7 4.6 29.6 2.5 24 2.5c-7.6 0-14.1 4.3-17.7 10.6z"/>
          <path fill="#FBBC05" d="M24 43.5c5.6 0 10.7-2.1 14.7-5.6l-6.8-5.6c-2 1.6-4.7 2.6-7.9 2.6-6 0-11.1-4.1-12.9-9.6l-6.6 5.1C9.8 39.1 16.4 43.5 24 43.5z"/>
          <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-1.2 3-4.1 6.5-11.3 6.5-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.7 4.6 29.6 2.5 24 2.5 12.7 2.5 3.5 11.7 3.5 23S12.7 43.5 24 43.5c11.3 0 20.5-9.2 20.5-20.5 0-1.4-.2-2.8-.4-4z"/>
        </g>
      </svg>
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default LoginGoogleButton;

