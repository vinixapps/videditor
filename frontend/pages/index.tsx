import React, { useState, useEffect } from "react";
import CreditInfo from "../components/CreditInfo";
import LoginGoogleButton from "../components/LoginGoogleButton";
import CheckoutModal from "../components/CheckoutModal";
import ProcessingStatus from "../components/ProcessingStatus";
import UploadSection from "../components/UploadSection";
import styles from "../styles/Home.module.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [userCredit, setUserCredit] = useState<number>(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
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
    setIsLoadingUser(true);
    const email = prompt("Enter your Google email (dummy)");
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

  const handleFileChange = (file: File) => {
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const handleProcess = async () => {
    if (!videoFile) return;
    if (userCredit <= 0) {
      alert("You don't have enough credit. Please top up first!");
      return;
    }
    setProcessing(true);
    setResultUrl(null);
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
        setUserCredit((c) => c - 1);
      } else {
        alert("Failed to process video: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error while processing video: " + err.message);
    }
    setProcessing(false);
  };

  const handleCheckout = async (amount: number) => {
    setPaymentProcessing(true);
    setTimeout(async () => {
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
      alert(`Top up ${amount} credits successful!`);
    }, 1800);
  };

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
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Video Subtitle/Watermark Remover</h1>
        <p className={styles.subtitle}>
          Remove subtitles or watermarks from your videos automatically with AI.
          <span className={styles.highlight}>First minute free!</span>
        </p>
      </div>

      <div className={styles.userSection}>
        <CreditInfo credits={userCredit} isLoading={isLoadingUser} />
        {user ? (
          <div className={styles.userInfo}>
            <img src={user.avatar || "/logo.png"} alt="avatar" className={styles.avatar} />
            <span className={styles.userName}>{user.name || user.email}</span>
            <button onClick={handleLogout} className={styles.logout}>Logout</button>
          </div>
        ) : (
          <LoginGoogleButton onClick={handleLogin} isLoading={isLoadingUser} />
        )}
      </div>

      <button className={styles.topup} onClick={() => setShowCheckout(true)} disabled={!user}>
        Top Up / Buy Credit
      </button>

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onCheckout={handleCheckout}
        isProcessing={paymentProcessing}
      />

      <div className={styles.card}>
        <UploadSection onFileChange={handleFileChange} videoUrl={videoUrl} disabled={processing || !user} />

        <ProcessingStatus show={processing} text="Processing your video..." />

        <button
          onClick={handleProcess}
          disabled={!videoFile || processing || !user || userCredit <= 0}
          className={styles.processButton}
        >
          {processing ? "Processing..." : userCredit <= 0 ? "Out of credit" : "Remove Subtitle/Watermark"}
        </button>

        {resultUrl && (
          <div className={styles.resultBox}>
            <label className={styles.resultLabel}>Result:</label>
            <video src={resultUrl} controls className={styles.resultVideo} />
            <a href={resultUrl} download className={styles.downloadButton}>Download Result</a>
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Video Subtitle Remover. Powered by AI.
      </footer>
    </div>
  );
}
