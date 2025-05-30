import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const EducationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";

  const [form, setForm] = useState({
    name: "",
    materi: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/educations/${id}`);
        setForm({
          name: res.data.data.name,
          materi: res.data.data.materi,
        });
      } catch (error) {
        console.error("Gagal mengambil data materi:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi optional, misal jika kamu ingin cek materi bukan file tapi string URL
    if (form.materi && typeof form.materi !== "string") {
      alert("Materi harus berupa link URL");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/educations/${id}`,
        {
          name: form.name,
          materi: form.materi,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // kalau backend butuh token
            "Content-Type": "application/json",
          },
        }
      );

      alert("Data berhasil diperbarui");
      navigate(`${basePath}/Education/Details/${id}`); // redirect ke list
    } catch (err) {
      console.error("Gagal update:", err);
      alert("Terjadi kesalahan saat update");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mt-4">
          Edit Data <span className="text-secondary">Materi</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📘 Data Materi
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <label className="block mb-1 font-medium">Nama Materi</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nama Materi"
                className="input w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Link Materi (Canva/Drive)
              </label>
              <input
                type="url"
                name="materi"
                value={form.materi}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
                className="input w-full"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md text-white bg-primary hover:bg-primary-focus transition"
        >
          Simpan Data
        </button>
      </form>
    </div>
  );
};

export default EducationEdit;
