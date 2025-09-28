import React, { useState } from "react";
import UploadSection from "../components/UploadSection"; // pastikan path sesuai

const dummyResultUrl = "/sample-result.mp4"; // Ganti nanti ke URL backend

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!videoFile) return;
    setProcessing(true);
    setTimeout(() => {
      setResultUrl(dummyResultUrl);
      setProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-2 py-8">
      {/* Logo/Title */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">
          Video Subtitle/Watermark Remover
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Remove subtitles or watermark from your video automatically with AI.  
          <span className="block text-sm text-blue-500 mt-2">1st minute free!</span>
        </p>
      </div>

      {/* Upload */}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4">
        <UploadSection
          onFileChange={(file) => {
            setVideoFile(file);
            setVideoUrl(URL.createObjectURL(file));
            setResultUrl(null);
          }}
          videoUrl={videoUrl}
        />

        <button
          onClick={handleProcess}
          disabled={!videoFile || processing}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
        >
          {processing ? "Processing..." : "Remove Subtitle/Watermark"}
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
