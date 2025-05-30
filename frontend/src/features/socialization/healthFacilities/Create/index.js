import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

const HealthFacilitiesForm = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    region_id: "",
    subdistrict_id: "",
    category: "",
    type: "",
    leader: "",
    activity: "",
    time: "",
    gender_man: "",
    gender_women: "",
    age_19to44years: "",
    age_over44years: "",
  });

  const [regions, setRegions] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [isSubdistrictDisabled, setIsSubdistrictDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/region");
        console.log("Regions:", res.data); // Tambahkan log ini
        setRegions(res.data);
      } catch (error) {
        console.error("Gagal mengambil data wilayah:", error.message);
      }
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
      setForm({ ...form, subdistrict_id: "" }); // Reset subdistrict_id
    }
  }, [form.region_id]);

  const [skFile, setSkFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoLink, setVideoLink] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // mencegah submit berkali-kali
    setLoading(true);

    if (!form.time) {
      alert("Tanggal kegiatan wajib diisi.");
      setLoading(false);
      return;
    }

    // Validasi ukuran SK (maks 5MB)
    if (skFile && skFile.size > 5 * 1024 * 1024) {
      alert("File SK maksimal 5MB.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Tambahkan semua input dari form (kecuali file)
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val);
    });

    // Tambahkan file foto
    photoFiles.forEach((file) => {
      if (file) formData.append("photo", file); // Gunakan key sama untuk array
    });

    // Tambahkan video link
    formData.append("video", videoLink || "");

    // Tambahkan file SK (jika ada)
    if (skFile) {
      formData.append("sk", skFile);
    }

    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage

      const response = await axios.post(
        "http://localhost:5000/health_facilities",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Data berhasil dikirim");

      const newId = response.data.id;
      navigate(`${basePath}/HealthFacility/Detail/${newId}`);

      // Reset form hanya jika sukses
      setForm({
        name: "",
        address: "",
        region_id: "",
        subdistrict_id: "",
        category: "",
        type: "",
        leader: "",
        activity: "",
        time: "",
        gender_man: "",
        gender_women: "",
        age_19to44years: "",
        age_over44years: "",
      });
      setPhotoFiles([]);
      setVideoLink("");
      setSkFile(null);
    } catch (err) {
      console.error("❌ Submit Error:", err);
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const handleSinglePhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB.");
      return;
    }

    const updatedFiles = [...photoFiles];
    updatedFiles[index] = file;
    setPhotoFiles(updatedFiles);
  };

  const handleAddPhotoInput = () => {
    if (photoFiles.length >= 3) {
      alert("Maksimal 3 foto yang bisa diunggah.");
      return;
    }
    setPhotoFiles([...photoFiles, null]);
  };

  const handleRemovePhoto = (index) => {
    const updatedFiles = photoFiles.filter((_, i) => i !== index);
    setPhotoFiles(updatedFiles);
  };

  return (
    <div className="max-w-6xl mx-auto bg-base-100 p-8 rounded-lg shadow space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mt-4">
          Tambah Data{" "}
          <span className="text-secondary">Fasilitas Kesehatan</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Informasi Fasilitas Kesehatan */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📘 Data Fasilitas Kesehatan
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nama Fasilitas Kesehatan"
              className="input"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Pilih Kategori Fasilitas Kesehatan
              </option>
              <option value="klinik">klinik</option>
              <option value="Puskesmas">Puskesmas</option>
              <option value="RumahSakit">Rumah Sakit</option>
            </select>

            <input
              name="leader"
              value={form.leader}
              onChange={handleChange}
              placeholder="Nama Ketua"
              className="input"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Pilih Instansi Fasilitas Kesehatan
              </option>
              <option value="Swasta">Swasta</option>
              <option value="Negeri">Pemerintah</option>
            </select>

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
              value={form.time || ""}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        </div>

        {/* Dokumen */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📎 Upload Dokumen
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* Upload Maksimal 3 Foto */}
            <div>
              <label className="block mb-1 font-medium">
                🖼️ Foto Kegiatan (maks. 3)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Format JPG,JPEG,PNG, maksimal 2MB per foto.
              </p>

              {photoFiles.map((file, index) => (
                <div className="flex items-center gap-2 relative border rounded p-2 mt-2 bg-gray-50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleSinglePhotoChange(e, index)}
                    className="w-full"
                  />
                  {file ? (
                    <span className="text-sm text-gray-700 truncate max-w-xs">
                      {file.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Belum ada foto
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Hapus Foto"
                  >
                    <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                  </button>
                </div>
              ))}

              {photoFiles.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddPhotoInput}
                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  ➕ Tambah Foto
                </button>
              )}
            </div>

            {/* Link Video */}
            <div>
              <label className="block mb-1 font-medium">
                🎥 Link Video Kegiatan
              </label>
              <input
                type="url"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="https://youtu.be/video"
              />
            </div>

            {/* Upload SK */}
            <div>
              <label className="block mb-1 font-medium">📄 SK</label>
              <p className="text-sm text-gray-500 mb-2">
                Format PDF/DOC/DOCX, maksimal 5MB.
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setSkFile(e.target.files[0])}
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
          </div>
        </div>

        {/* Statistik Demografi */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📊 Statistik Demografi
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <input
              type="number"
              name="gender_man"
              value={form.gender_man}
              onChange={handleChange}
              placeholder="Jumlah Laki-laki"
              className="input"
            />
            <input
              type="number"
              name="gender_women"
              value={form.gender_women}
              onChange={handleChange}
              placeholder="Jumlah Perempuan"
              className="input"
            />
            <input
              type="number"
              name="age_19to44years"
              value={form.age_19to44years}
              onChange={handleChange}
              placeholder="19-44 Tahun"
              className="input"
            />
            <input
              type="number"
              name="age_over44years"
              value={form.age_over44years}
              onChange={handleChange}
              placeholder=">44 Tahun"
              className="input"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md text-white bg-primary disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Data"}
        </button>
      </form>
    </div>
  );
};

export default HealthFacilitiesForm;
