import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const EducationDetail = () => {
  const { id } = useParams();
  const [materiUrl, setMateriUrl] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [error, setError] = useState(null);
  const [role, setRole] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeContainerRef = useRef(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const convertGoogleSlidesToEmbed = (url) => {
    try {
      const urlObj = new URL(url);
      const idMatch = urlObj.pathname.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (idMatch && idMatch[1]) {
        return `https://docs.google.com/presentation/d/${idMatch[1]}/embed?start=false&loop=false&delayms=3000`;
      }
    } catch {
      return null;
    }
    return null;
  };

  const convertDriveToEmbed = (url) => {
    try {
      const urlObj = new URL(url);
      const idMatch = urlObj.pathname.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }
    } catch {
      return null;
    }
    return null;
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const fetchEducations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/educations/${id}`
        );
        const { materi } = response.data.data;

        if (!materi) {
          setError("File materi belum tersedia");
          return;
        }

        setMateriUrl(materi);

        let ext = "";
        try {
          const urlObj = new URL(materi);
          const pathname = urlObj.pathname;
          const possibleExt = pathname.split(".").pop().toLowerCase();

          if (["pdf", "ppt", "pptx"].includes(possibleExt)) {
            ext = possibleExt;
          } else if (materi.includes("drive.google.com/file")) {
            ext = "drive";
          } else if (materi.includes("drive.google.com")) {
            ext = "pdf"; // fallback
          } else if (materi.includes("canva.com")) {
            ext = "canva";
          }
        } catch {
          setError("URL materi tidak valid");
          return;
        }

        setFileExt(ext);
      } catch {
        setError("Gagal mengambil data materi");
      }
    };

    fetchEducations();

    // Sync fullscreen state when user exits fullscreen via ESC etc
    const fullscreenChangeHandler = () => {
      const fsElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(!!fsElement);
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);
    document.addEventListener("webkitfullscreenchange", fullscreenChangeHandler);
    document.addEventListener("mozfullscreenchange", fullscreenChangeHandler);
    document.addEventListener("MSFullscreenChange", fullscreenChangeHandler);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
      document.removeEventListener(
        "webkitfullscreenchange",
        fullscreenChangeHandler
      );
      document.removeEventListener("mozfullscreenchange", fullscreenChangeHandler);
      document.removeEventListener("MSFullscreenChange", fullscreenChangeHandler);
    };
  }, [id]);

  const handleFullscreenToggle = () => {
    const elem = iframeContainerRef.current;
    if (!elem) return;

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!materiUrl) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-base-200 px-4 py-10 sm:px-6 lg:px-8 relative">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-left">Detail Materi</h2>

        {/* Teks klik fullscreen */}
        <div
          className="mb-2 text-sm text-gray-500 text-center cursor-pointer select-none"
          onClick={handleFullscreenToggle}
          title={isFullscreen ? "Kembali ke tampilan semula" : "Klik untuk fullscreen"}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleFullscreenToggle();
          }}
        >
          {isFullscreen ? "Klik disini untuk kembali ke tampilan semula" : "Klik disini untuk lihat fullscreen"}
        </div>

        {/* Container iframe yang juga bisa klik fullscreen */}
        <div
          ref={iframeContainerRef}
          onClick={handleFullscreenToggle}
          style={{ cursor: "pointer" }}
          className={`w-full rounded-md border overflow-hidden ${
            isFullscreen
              ? "fixed top-0 left-0 w-screen h-screen z-[9999] bg-base-100"
              : "h-[calc(100vh-220px)] sm:h-[calc(100vh-240px)]"
          }`}
          title={isFullscreen ? "Klik area materi untuk keluar fullscreen" : "Klik area materi untuk fullscreen"}
        >
          {materiUrl.includes("docs.google.com/presentation") ? (
            <iframe
              title="google-slides"
              src={convertGoogleSlidesToEmbed(materiUrl)}
              style={{ width: "100%", height: "100%" }}
              frameBorder="0"
              allowFullScreen
            />
          ) : fileExt === "drive" ? (
            <iframe
              title="drive-file"
              src={convertDriveToEmbed(materiUrl)}
              style={{ width: "100%", height: "100%" }}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : fileExt === "canva" ? (
            <iframe
              title="canva-viewer"
              src={materiUrl}
              style={{ width: "100%", height: "100%" }}
              frameBorder="0"
              allowFullScreen
            />
          ) : fileExt === "pdf" ? (
            <div
              className={`w-full overflow-auto rounded-md border ${
                isFullscreen ? "h-full" : "h-[calc(100vh-220px)] sm:h-[calc(100vh-240px)]"
              }`}
            >
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={materiUrl}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </div>
          ) : fileExt === "ppt" || fileExt === "pptx" ? (
            <iframe
              title="ppt-viewer"
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                materiUrl
              )}&embedded=true`}
              style={{ width: "100%", height: "100%" }}
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <p>Format file tidak didukung atau bukan file langsung.</p>
          )}
        </div>

        {fileExt === "canva" && role === "admin" && (
          <a
            href={materiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-4"
          >
            Buka Materi di Canva
          </a>
        )}
      </div>
    </div>
  );
};

export default EducationDetail;
