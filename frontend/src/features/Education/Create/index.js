import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EducationCreate = () => {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    materi: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  try {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage

    const response = await axios.post(
      "http://localhost:5000/educations",
      form,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Data berhasil dikirim");

    const newId = response.data.id || ""; // fallback jika ID tidak dikembalikan
    navigate(`/app/Education/Detail/${newId}`);

    setForm({
      name: "",
      materi: "",
    });
  } catch (error) {
    console.error("Gagal mengirim:", error);
    alert("Gagal mengirim data");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mt-4">
          Tambah Data <span className="text-secondary">Materi</span>
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
              className="input input-bordered w-full"
            />
            </div>

            <div>
              <label className="block mb-1 font-medium">Link Materi</label>
              <input
                type="url"
                name="materi"
                value={form.materi}
                onChange={handleChange}
                placeholder="https://example.com/materi.pdf"
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md text-white bg-primary"
        >
          Simpan Data
        </button>
      </form>
    </div>
  );
};

export default EducationCreate;
