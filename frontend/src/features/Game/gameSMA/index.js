import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameSMA = () => {
  const [iframeUrl, setIframeUrl] = useState(
    "https://quizizz.com/pro/join/quiz/66f9c58d271c172706c02b48/start?studentShare=true"
  );
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
  }, []);

  // ID quiz Quizizz yang ingin ditautkan di link explore
  const educationUnitId = "5e781af722b30f001ba06a6b";

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 relative">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-left text-black">
          Games Tingkat SMA
        </h2>

        <div className="w-full max-w-5xl mx-auto h-[400px] rounded-lg overflow-hidden mb-4">
          <iframe
            src={iframeUrl}
            title="Quizizz Game"
            width="100%"
            height="100%"
            allowFullScreen
            className="rounded-lg border-none"
          />
        </div>

        <div className="text-left mt-4">
          <a
            href={`https://quizizz.com/admin/quiz/${educationUnitId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Explore more at Quizizz.
          </a>
        </div>

        {role === "admin" && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate(" ")}
              className="btn bg-[#2F2FAF] text-white hover:bg-[#1f1f8f] min-w-[100px]"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSMA;
