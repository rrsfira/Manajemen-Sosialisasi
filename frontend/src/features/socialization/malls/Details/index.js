import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

const MallsDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";

  useEffect(() => {
    fetch(`http://localhost:5000/malls/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res); // gunakan langsung data dari backend tanpa manipulasi ulang
        setCurrentIndex(0);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  // Gunakan useEffect agar setRole dipanggil sekali saat komponen mount
  const token = localStorage.getItem("token");
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);

      // Cek apakah token masih berlaku
      const isTokenValid = decoded.exp * 1000 > Date.now();
      if (isTokenValid) {
        userRole = decoded.role; // Harusnya 'admin' atau 'superadmin'
      }
    } catch (error) {
      console.error("Invalid token");
    }
  }

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
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <div className="relative">
          {images.length > 0 ? (
            <div className=" p-6 rounded-xl ">
              <div className="relative w-full max-h-[400px]">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentIndex]}
                      alt="Foto kegiatan"
                      className="w-full max-h-[400px] object-contain rounded-lg"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-200"
                          style={{ zIndex: 1 }}
                        >
                          <ArrowLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-200"
                          style={{ zIndex: 1 }}
                        >
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-center text-gray-500">
                    Tidak ada foto kegiatan.
                  </p>
                )}
              </div>
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
            <DetailLinkItem label="SK" value={data.SK} href={data.SK_url} />
            <DetailItem label="Nama Ketua Tim" value={data.leader} />
          </div>

          <div className="space-y-3">
            <DetailItem label="Jenis Kegiatan" value={data.activity} />
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
            <DetailItem label="Usia 19–44 Tahun" value={data.age_19to44years} />
            <DetailItem label="Usia >44 Tahun" value={data.age_over44years} />
          </div>
        </div>
        <div className="text-center">
          {(userRole === "admin" || userRole === "superadmin") && (
            <>
              <button
                className="w-full py-1 rounded-md text-white bg-primary"
                onClick={() => navigate(`${basePath}/Mall/Edit/${data.id}`)}
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
  <div className="flex items-start mb-2">
    <div className="w-40 font-semibold">{label}</div>
    <div className="mr-1">:</div>
    <div className="flex-1 break-words">
      {value || <span className="text-gray-400">-</span>}
    </div>
  </div>
);

const DetailLinkItem = ({ label, value, href }) => (
  <div className="flex items-start mb-2">
    <div className="w-40 font-semibold">{label}</div>
    <div className="mr-1">:</div>
    <div className="flex-1 break-words">
      {value ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-words"
        >
          {value}
        </a>
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </div>
  </div>
);

export default MallsDetail;
