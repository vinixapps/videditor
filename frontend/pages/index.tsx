import React, { useState, useEffect } from "react";
import CreditInfo from "../components/CreditInfo";
import LoginGoogleButton from "../components/LoginGoogleButton";
import CheckoutModal from "../components/CheckoutModal";
import ProcessingStatus from "../components/ProcessingStatus";
import UploadSection from "../components/UploadSection";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // atur sesuai deploy

export default function Home() {
  const [user, setUser] = useState<any>(null); // nanti bisa {email, name, avatar, credit}
  const [userCredit, setUserCredit] = useState<number>(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // --- User Auth / Session ---
  useEffect(() => {
    // Auto check session user
    fetch(`${BACKEND_URL}/auth/me`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data.user);
        setUserCredit(data.user.credit || 0);
      })
      .catch(() => {
        setUser(null);
        setUserCredit(0);
      })
      .finally(() => setIsLoadingUser(false));
  }, []);

  const handleLogin = async () => {
    // Dummy Google login
    setIsLoadingUser(true);
    // Simulasi login, ganti ke real login kalau sudah siap
    const email = prompt("Masukkan email Google Anda (dummy)");
    if (!email) {
      setIsLoadingUser(false);
      return;
    }
    const name = email.split("@")[0];
    const avatar = "/logo.png";
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, avatar }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      setUserCredit(data.user.credit || 0);
    }
    setIsLoadingUser(false);
  };

  // --- Handle Upload ---
  const handleFileChange = (file: File) => {
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setResultUrl(null);
  };

  // --- Proses Video ke Backend ---
  const handleProcess = async () => {
    if (!videoFile) return;
    if (userCredit <= 0) {
      alert("Credit kamu habis. Silakan top up dulu!");
      return;
    }
    setProcessing(true);
    setResultUrl(null);
    // Kirim file ke backend
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("userId", user?.email || "guest");

    try {
      const res = await fetch(`${BACKEND_URL}/videoProcess/remove`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.resultUrl) {
        setResultUrl(data.resultUrl.startsWith("http") ? data.resultUrl : `${BACKEND_URL}${data.resultUrl}`);
        // Kurangi credit (simulasi, nanti lebih baik get ulang dari backend)
        setUserCredit((c) => c - 1);
      } else {
        alert("Gagal proses video: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error saat proses video: " + err.message);
    }
    setProcessing(false);
  };

  // --- Handle Top Up Credit ---
  const handleCheckout = async (amount: number) => {
    setPaymentProcessing(true);
    // Dummy top up (production: integrate ke payment gateway)
    setTimeout(async () => {
      // Simulasi top up credit user di backend
      const userId = user?.email || "guest";
      await fetch(`${BACKEND_URL}/payment/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          paymentId: "SIMULATED",
          status: "PAID",
          amount,
        }),
      });
      setUserCredit((c) => c + amount);
      setShowCheckout(false);
      setPaymentProcessing(false);
      alert(`Top up ${amount} credit berhasil!`);
    }, 1800);
  };

  // --- Logout (optional) ---
  const handleLogout = async () => {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setUserCredit(0);
    setVideoFile(null);
    setVideoUrl(null);
    setResultUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-2 py-8">
      {/* Logo/Title */}
      <div className="mb-6 text-center">
        <img src="/logo.png" alt="Logo" className="mx-auto w-14 mb-2" />
        <h1 className="text-3xl font-bold mb-2 text-blue-700">
          Video Subtitle/Watermark Remover
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Remove subtitles or watermark from your video automatically with AI.  
          <span className="block text-sm text-blue-500 mt-2">1st minute free!</span>
        </p>
      </div>

      {/* Info Credit + Login/Logout */}
      <div className="w-full max-w-md flex flex-col gap-2 items-center mb-3">
        <CreditInfo credits={userCredit} isLoading={isLoadingUser} />
        {user ? (
          <div className="flex items-center gap-2">
            <img
              src={user.avatar || "/logo.png"}
              alt="avatar"
              className="w-7 h-7 rounded-full border"
            />
            <span className="text-sm">{user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-600 ml-2"
            >
              Logout
            </button>
          </div>
        ) : (
          <LoginGoogleButton onClick={handleLogin} isLoading={isLoadingUser} />
        )}
      </div>

      {/* Tombol Top Up */}
      <button
        className="mb-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl"
        onClick={() => setShowCheckout(true)}
        disabled={!user}
      >
        Top Up / Buy Credit
      </button>

      {/* Modal Checkout */}
      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onCheckout={handleCheckout}
        isProcessing={paymentProcessing}
      />

      {/* Upload & Process */}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4">
        <UploadSection
          onFileChange={handleFileChange}
          videoUrl={videoUrl}
          disabled={processing || !user}
        />

        <ProcessingStatus show={processing} text="Sedang memproses video kamu..." />

        <button
          onClick={handleProcess}
          disabled={!videoFile || processing || !user || userCredit <= 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
        >
          {processing
            ? "Processing..."
            : userCredit <= 0
            ? "Credit habis"
            : "Remove Subtitle/Watermark"}
        </button>

        {/* Hasil */}
        {resultUrl && (
          <div className="mt-4">
            <label className="text-sm text-gray-600 font-medium">Result:</label>
            <video
              src={resultUrl}
              controls
              className="mt-2 w-full rounded-xl border"
              style={{ maxHeight: 280 }}
            />
            <a
              href={resultUrl}
              download
              className="block mt-2 text-center bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 font-semibold"
            >
              Download Result
            </a>
          </div>
        )}
      </div>
      <footer className="mt-10 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Video Subtitle Remover. Powered by AI.
      </footer>
    </div>
  );
}
