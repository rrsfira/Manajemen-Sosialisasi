import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const EducationDetail = () => {
  const { id } = useParams();
  const [fileUrl, setFileUrl] = useState("");
  const [fileExt, setFileExt] = useState(""); 
  const [error, setError] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/educations/${id}`)
      .then((response) => {
        const { materi } = response.data;
        if (!materi) {
          setError("File materi belum tersedia");
          return;
        }

        // Cek apakah materi adalah URL eksternal
        const isExternal = materi.startsWith("http");
        const url = isExternal ? materi : `http://localhost:5000/uploads/materi/${materi}`;

        setFileUrl(url);

        const ext = url.split(".").pop().toLowerCase().split("?")[0]; // handle ?id=.. di akhir
        setFileExt(ext);
      })
      .catch(() => {
        setError("Gagal mengambil data materi");
      });
  }, [id]);

  const renderViewer = () => {
    if (fileExt === "pdf") {
      return (
        <div className="w-full h-[calc(100vh-200px)] overflow-auto">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      );
    }

    if (fileExt === "ppt" || fileExt === "pptx") {
      return (
        <div className="w-full h-[calc(100vh-200px)]">
          <iframe
            title="ppt-viewer"
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            style={{ width: "100%", height: "100%" }}
            frameBorder="0"
          />
        </div>
      );
    }

    // If it's an external URL from Google Drive, Canva, etc.
    if (fileUrl.includes("drive.google.com") || fileUrl.includes("canva.com") || fileUrl.startsWith("http")) {
      return (
        <div className="w-full h-[calc(100vh-200px)]">
          <iframe
            title="external-viewer"
            src={fileUrl}
            style={{ width: "100%", height: "100%" }}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      );
    }

    return <p>Format file tidak didukung.</p>;
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 relative">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-left">Detail Materi</h2>
        {error ? <p className="text-red-500">{error}</p> : fileUrl ? renderViewer() : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default EducationDetail;
