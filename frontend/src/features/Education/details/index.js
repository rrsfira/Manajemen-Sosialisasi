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
  const [fileExt, setFileExt] = useState(""); // ekstensi file
  const [error, setError] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/educations/${id}`)
      .then((response) => {
        const { materi } = response.data.data;
        if (!materi) {
          setError("File materi belum tersedia");
          return;
        }
        const url = `http://localhost:5000/uploads/materi/${materi}`;
        setFileUrl(url);

        // ambil ekstensi file (lowercase)
        const ext = materi.split(".").pop().toLowerCase();
        setFileExt(ext);
      })
      .catch(() => {
        setError("Gagal mengambil data materi");
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 relative">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-left">Detail Materi</h2>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : !fileUrl ? (
          <p>Loading...</p>
        ) : fileExt === "pdf" ? (
          // PDF viewer
          <div className="w-full h-[calc(100vh-200px)] overflow-auto">
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          </div>
        ) : fileExt === "ppt" || fileExt === "pptx" ? (
          // PPT/PPTX embed via Google Docs Viewer
          <div className="w-full h-[calc(100vh-200px)]">
            <iframe
              title="ppt-viewer"
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                fileUrl
              )}&embedded=true`}
              style={{ width: "100%", height: "100%" }}
              frameBorder="0"
            />
          </div>
        ) : (
          <p>Format file tidak didukung.</p>
        )}
      </div>
    </div>
  );
};

export default EducationDetail;
