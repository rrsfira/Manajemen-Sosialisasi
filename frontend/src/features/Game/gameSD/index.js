import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameSD = () => {
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
    <div className="min-h-screen bg-base-200 px-4 py-6 sm:px-6 sm:py-10 relative">
      <div className="bg-base-100 p-4 sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Games Tingkat SD
        </h2>

        <div className="w-full mb-4">
          <div className="w-full aspect-[9/16] sm:aspect-[16/9] max-w-4xl mx-auto">
            <iframe
              src={iframeUrl}
              title="Quizizz Game"
              className="w-full h-full rounded-lg border-none"
              allowFullScreen
            />
          </div>
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

export default GameSD;
