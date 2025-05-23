import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EducationUnitDetail = () => {
  const [role, setRole] = useState(""); // untuk memberi hak role
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/education_units/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setCurrentIndex(0);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  // Gunakan useEffect agar setRole dipanggil sekali saat komponen mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      const normalized = storedRole.trim().toLowerCase();
      setRole(normalized);
    }
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  // Foto array dari backend
  const photoArray = Array.isArray(data.photo)
    ? data.photo
    : data.photo
    ? [data.photo]
    : [];

  const images = photoArray.filter(
    (url) => typeof url === "string" && url.trim() !== ""
  ); // pastikan bukan null/kosong

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // Dapatkan ID video YouTube
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]+)/);
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : null;
  };

  const embedUrl = getYoutubeEmbedUrl(data.video);

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Video */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg flex justify-center">
        {embedUrl ? (
          <iframe
            width="100%"
            height="400"
            src={embedUrl}
            title="Video Sosialisasi"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        ) : (
          <p className="text-gray-500 text-center">Tidak ada video.</p>
        )}
      </div>
      {/* Foto Carousel */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg relative">
        <div className="relative">
          {images.length > 0 ? (
            <div className="relative">
              <img
                src={images[currentIndex]}
                alt="Tidak ada foto kegiatan."
                className="w-full max-h-[400px] object-contain rounded-lg"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black w-10 h-10 rounded-full shadow hover:bg-gray-100 z-10"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black w-10 h-10 rounded-full shadow hover:bg-gray-100 z-10"
                  >
                    &#8594;
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Tidak ada foto kegiatan.
            </p>
          )}
        </div>

        {/* Detail Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mt-10 mb-8">
          {/* Kolom Kiri */}
          <div className="space-y-3">
            <DetailItem label="Nama" value={data.name} />
            <DetailItem label="Alamat" value={data.address} />
            <DetailItem label="Wilayah" value={data.region} />
            <DetailItem label="Kecamatan" value={data.subdistrict} />
            <div className="flex">
              <span className="w-40 font-semibold">SK</span>
              <span className="mr-1">:</span>
              {data.SK ? (
                <a
                  href={data.SK_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 text-blue-600 underline"
                >
                  {data.SK}
                </a>
              ) : (
                <span className="ml-4 text-gray-400">-</span>
              )}
            </div>
            <DetailItem label="Nama Ketua Tim" value={data.leader} />
            <DetailItem label="Jenis Kegiatan" value={data.activity} />
          </div>

          <div className="space-y-3">
            <DetailItem
              label="Tanggal Kegiatan"
              value={
                data.time && !isNaN(new Date(data.time))
                  ? new Date(data.time).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"
              }
            />
            <DetailItem label="Jumlah Laki-Laki" value={data.gender_man} />
            <DetailItem label="Jumlah Perempuan" value={data.gender_women} />
            <DetailItem label="Usia <6 Tahun" value={data.age_under6years} />
            <DetailItem label="Usia 6–10 Tahun" value={data.age_6to10years} />
            <DetailItem label="Usia 11–18 Tahun" value={data.age_11to18years} />
            <DetailItem label="Usia >44 Tahun" value={data.age_over44years} />
          </div>
        </div>
        <div className="text-center">
          {role === "admin" && (
            <>
              <button
                className="w-full py-1 rounded-md text-white bg-primary"
                onClick={() => navigate(`/app/EducationUnit/Edit/${data.id}`)}
              >
                Edit Data
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex">
    <span className="w-40 font-semibold">{label}</span>
    <span className="mr-1">:</span>
    <span className="ml-4">{value || "-"}</span>
  </div>
);

export default EducationUnitDetail;
