import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GameSD = () => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [gameSDId, setGameSDId] = useState(""); // untuk link explore
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);

    const fetchGameData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/games/2");
        setIframeUrl(res.data.quizizz_url);
        
        // jika ingin ambil ID quiz dari URL Quizizz
        const match = res.data.quizizz_url.match(/quiz\/([^/?]+)/);
        if (match) {
          setGameSDId(match[1]);
        }
      } catch (error) {
        console.error("Gagal mengambil data game:", error);
      }
    };

    fetchGameData();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 relative">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Games Tingkat SD
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

        {gameSDId && (
          <div className="text-left mt-4">
            <a
              href={`https://quizizz.com/admin/quiz/${gameSDId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Explore more at Quizizz.
            </a>
          </div>
        )}

        {role === "admin" && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate(`/app/Game/Edit/${2}`)} 
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
