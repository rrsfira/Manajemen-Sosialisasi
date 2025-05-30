import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const GameSMA = () => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [gameSMAId, setGameSMAId] = useState(""); // untuk link explore
  const [role, setRole] = useState("");
  const navigate = useNavigate();
    const location = useLocation(); // untuk mendapatkan lokasi
    const currentPath = location.pathname; // untuk mendapatkan path lokasi
    const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";
  

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);

    const fetchGameData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/games/4");
        const rawUrl = res.data.quizizz_url;

        // Ambil ID quiz dari link
        const match = rawUrl.match(/quiz\/([^/?]+)/);
        if (match) {
          const quizId = match[1];
          setGameSMAId(quizId);

          // Buat embed URL
          const embedUrl = `https://quizizz.com/embed/quiz/${quizId}`;
          setIframeUrl(embedUrl);
        } else {
          setIframeUrl(""); // fallback kalau tidak cocok
        }
      } catch (error) {
        console.error("Gagal mengambil data game:", error);
      }
    };

    fetchGameData();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 px-4 py-6 sm:px-6 sm:py-10 relative">
      <div className="bg-base-100 p-4 sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Games Tingkat SMA
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

        {gameSMAId && (
          <div className="text-left mt-4">
            <a
              href={`https://quizizz.com/admin/quiz/${gameSMAId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Explore more at Quizizz.
            </a>
          </div>
        )}

        {(role === "admin" || role === "superadmin") && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate(`${basePath}/Game/Edit/${4}`)} 
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
