import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";

const HotelEdit = () => {
  const { id } = useParams(); // Ambil id dari URL
  const navigate = useNavigate();
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";

  const [form, setForm] = useState({
    name: "", // Nama Hotel
    address: "", // string alamat
    region_id: "", // id region dari Hotel
    subdistrict_id: "", // id subdistrict dari Hotel
    SK: "", // string URL/file lama
    leader: "", // ketua tim
    activity: "", // aktivitas sosialisasi
    time: "", // tanggal
    gender_man: "", // gender laki-laki
    gender_women: "", // gender perempuan
    age_19to44years: "", // umur 11-18 tahun
    age_over44years: "", // umur diatas 44 tahun
    photo: [], // array string URL/file lama foto
    video: "", // link video
  });

  // Files yang akan diupload baru
  const [newPhotos, setNewPhotos] = useState([]); // file foto baru (File objects)
  const [skFile, setSkFile] = useState(null); // file SK baru (File object)
  const [videoLink, setVideoLink] = useState(""); // link video baru

  // Untuk kontrol select wilayah dan kecamatan
  const [regions, setRegions] = useState([]); // array id region
  const [subdistricts, setSubdistricts] = useState([]); // array id subdistrict
  const [isSubdistrictDisabled, setIsSubdistrictDisabled] = useState(true); // flag untuk disable select kecamatan
  const [editingLocation, setEditingLocation] = useState(false); // flag untuk menampilkan form edit lokasi

  useEffect(() => {
    // Ambil data berdasar id
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/hotels/${id}`);
        const data = res.data;

        // data.photo diasumsikan array URL/file lama
        // data.SK diasumsikan string URL/file lama
        setForm({
          ...data,
          photo: data.photo || [],
          video: data.video || "",
          SK: data.SK || "",
          time: data.time ? data.time.slice(0, 10) : "",
        });

        setVideoLink(data.video || "");
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    // Ambil list wilayah
    const fetchRegions = async () => {
      const res = await axios.get("http://localhost:5000/region");
      setRegions(res.data);
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    if (form.region_id) {
      setIsSubdistrictDisabled(false);
      const fetchSubdistricts = async () => {
        const res = await axios.get(
          `http://localhost:5000/region/subdistricts/${form.region_id}`
        );
        setSubdistricts(res.data);
      };
      fetchSubdistricts();
    } else {
      setIsSubdistrictDisabled(true);
      setSubdistricts([]);
      setForm((prev) => ({ ...prev, subdistrict_id: "" }));
    }
  }, [form.region_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle video link input
  const handleVideoChange = (e) => {
    setVideoLink(e.target.value);
    setForm((prev) => ({ ...prev, video: e.target.value }));
  };

  // Handle tambah input foto baru (maks 3 foto total)
  const handleAddPhotoInput = () => {
    if (newPhotos.length + form.photo.length < 3) {
      setNewPhotos((prev) => [...prev, null]);
    }
  };

  // Handle perubahan foto baru (file input)
  const handleSinglePhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewPhotos((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  // Hapus foto baru (file input)
  const handleRemovePhotoNew = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Hapus foto lama (URL) — misal user ingin hapus foto lama tanpa ganti file baru
  const handleRemovePhotoOld = (index) => {
    setForm((prev) => {
      const updatedPhotos = [...prev.photo];
      updatedPhotos.splice(index, 1);
      return { ...prev, photo: updatedPhotos };
    });
  };

  // Handle file SK baru
  const handleSkChange = (e) => {
    if (e.target.files[0]) {
      setSkFile(e.target.files[0]);
    }
  };

  // Hapus file SK lama
  const handleRemoveSkOld = () => {
    setForm((prev) => ({ ...prev, SK: "" }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append form fields (string fields)
    Object.entries(form).forEach(([key, val]) => {
      // photo dan SK bukan di sini karena file upload
      if (key !== "photo" && key !== "SK" && key !== "video") {
        formData.append(key, val);
      }
    });

    // Append video link (string)
    formData.append("video", videoLink || "");

    // Append old photos (URL string) dalam array json string, agar backend tahu foto mana yg dipertahankan
    formData.append("oldPhotos", JSON.stringify(form.photo));

    // Append new photos (File objects)
    newPhotos.forEach((file) => {
      if (file) formData.append("photo", file);
    });

    // Append old SK file (string URL), kalau masih ada
    formData.append("oldSK", form.SK || "");

    // Append SK file baru (File object)
    if (skFile) {
      formData.append("sk", skFile);
    }

    try {
      const token = localStorage.getItem("token"); // ← letakkan di sini

      if (id) {
        await axios.put(`http://localhost:5000/hotels/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        const res = await axios.post("http://localhost:5000/hotels", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        id = res.data.id; // asumsi respons mengembalikan ID baru
      }

      alert("Data berhasil disimpan");
      navigate(`${basePath}/Hotel/Detail/${id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mt-4">
          Edit Data <span className="text-secondary">Hotel</span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto space-y-6"
        encType="multipart/form-data"
      >
        {/* Informasi Hotel */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📘 Data Hotel
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nama Hotel"
              className="input"
            />
            <input
              name="leader"
              value={form.leader}
              onChange={handleChange}
              placeholder="Nama Ketua"
              className="input"
            />

            <input
              name="activity"
              value={form.activity}
              onChange={handleChange}
              placeholder="Jenis Kegiatan"
              className="input"
            />

            <input
              type="date"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Bagian Dokumen */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📎 Upload Dokumen
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Foto Lama */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                🖼️ Foto Kegiatan Lama
              </label>
              {form.photo.length === 0 ? (
                <p className="text-gray-400 italic">Belum ada foto lama</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {form.photo.map((url, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 border rounded overflow-hidden shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Foto lama ${i + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhotoOld(i)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:text-red-800 shadow"
                        title="Hapus Foto Lama"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Foto Baru */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                🖼️ Upload Foto Kegiatan Baru (maks. 3)
              </label>

              <div className="flex flex-col gap-3">
                {newPhotos.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 border rounded p-2 bg-gray-50 shadow-sm"
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => handleSinglePhotoChange(e, index)}
                      className="flex-grow"
                    />
                    {file ? (
                      <span className="truncate text-sm text-gray-700">
                        {file.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Belum ada file
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhotoNew(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Hapus Foto Baru"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                ))}

                {newPhotos.length + form.photo.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddPhotoInput}
                    className="self-start px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    ➕ Tambah Foto
                  </button>
                )}
              </div>
            </div>

            {/* SK Lama */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                📄 SK Lama
              </label>
              {form.SK ? (
                <div className="flex items-center gap-3 border rounded p-3 bg-gray-50 shadow-sm">
                  <a
                    href={form.SK_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline truncate max-w-xs"
                  >
                    Lihat SK
                  </a>
                  <button
                    type="button"
                    onClick={handleRemoveSkOld}
                    className="text-red-500 hover:text-red-700"
                    title="Hapus SK Lama"
                  >
                    <XMarkIcon className="h-8 w-8" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 italic">Belum ada file SK lama</p>
              )}
            </div>

            {/* Upload SK Baru */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                📄 Upload SK Baru (PDF, DOC, DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleSkChange}
                disabled={!!form.SK}
                className="block w-full border border-gray-300 rounded p-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {form.SK && (
                <p className="text-sm text-gray-500 mt-1">
                  Hapus SK lama terlebih dahulu untuk bisa unggah SK baru.
                </p>
              )}
              {skFile && !form.SK && (
                <p className="mt-2 text-sm text-gray-700 truncate max-w-xs">
                  File baru: {skFile.name}
                </p>
              )}
            </div>

            {/* Link Video */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold text-gray-700">
                🎥 Link Video Kegiatan
              </label>
              <input
                type="url"
                value={videoLink}
                onChange={handleVideoChange}
                placeholder="https://youtu.be/video"
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Alamat dan Wilayah */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📍 Alamat & Wilayah
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="md:col-span-2">
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Alamat"
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            {!editingLocation ? (
              <div className="md:col-span-2 w-full">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      ("WILAYAH " + form.region || "Wilayah tidak tersedia") +
                      "          -          " +
                      ("KECAMATAN " + form.subdistrict ||
                        "Kecamatan tidak tersedia")
                    }
                    onClick={() => setEditingLocation(true)}
                    className="input input-bordered bg-gray-50 hover:bg-gray-100 w-full text-center transition duration-150"
                    title="Klik untuk mengubah wilayah dan kecamatan"
                  />
                  <small className="text-gray-500 mt-1 block text-left">
                    Klik untuk mengubah wilayah dan kecamatan
                  </small>
                </div>
              </div>
            ) : (
              <>
                <select
                  name="region_id"
                  value={form.region_id}
                  onChange={handleChange}
                  required
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    Pilih Wilayah
                  </option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>

                <select
                  name="subdistrict_id"
                  value={form.subdistrict_id}
                  onChange={handleChange}
                  required
                  disabled={isSubdistrictDisabled}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    Pilih Kecamatan
                  </option>
                  {subdistricts.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Statistik Demografi */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📊 Statistik Demografi
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <input
              name="gender_man"
              value={form.gender_man}
              onChange={handleChange}
              placeholder="Jumlah Laki-laki"
              type="number"
              min={0}
              className="input"
            />
            <input
              name="gender_women"
              value={form.gender_women}
              onChange={handleChange}
              placeholder="Jumlah Perempuan"
              type="number"
              min={0}
              className="input"
            />
            <input
              name="age_19to44years"
              value={form.age_19to44years}
              onChange={handleChange}
              placeholder="Usia 19-44 Tahun"
              type="number"
              min={0}
              className="input"
            />
            <input
              name="age_over44years"
              value={form.age_over44years}
              onChange={handleChange}
              placeholder="Usia > 44 Tahun"
              type="number"
              min={0}
              className="input"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 rounded-md text-white bg-primary"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelEdit;
