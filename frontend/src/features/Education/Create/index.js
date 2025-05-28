import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EducationCreate = () => {
  const { id } = useParams(); // Ambil id dari URL
    const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    materi: "",
  });

  const [materi, setMateri] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    if (materi) {
      formData.append("materi", materi);
    }
    try {
      await axios.post("http://localhost:5000/educations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Data berhasil disimpan");
      setForm({ name: "", materi: "" });
      setMateri(null);
    } catch (error) {
      console.error("Gagal upload:", error);
      alert("Gagal menyimpan data");
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
        {/* Informasi Satuan Pendidikan */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📘 Data Materi
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nama Materi"
              className="input w-full"
            />

            <div>
              <label className="block mb-1 font-medium">
                📄 Materi (PDF, DOC, DOCX)
              </label>
              {form.materi && (
                <a
                  href={`http://localhost:5000/uploads/materi/${form.materi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 underline mb-2"
                >
                  Lihat Materi
                </a>
              )}
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                onChange={(e) => setMateri(e.target.files[0])}
                className="file-input file-input-bordered w-full"
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

export default EducationCreate;
