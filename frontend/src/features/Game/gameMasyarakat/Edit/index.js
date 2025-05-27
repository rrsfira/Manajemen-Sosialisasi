import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const GameEdit = () => {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    leader: "",
    quizizz_url: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/education_units/${id}`);
        setForm(res.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      if (id) {
        await axios.put(`http://localhost:5000/education_units/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5000/education_units", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      alert("Data berhasil disimpan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-8">
    <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-4">
      Edit <span className="text-secondary">Game</span>
    </h1>
  </div>

  <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
    {/* Informasi Satuan Pendidikan */}
    <div className="border rounded-lg shadow-sm">
      <div className="bg-secondary px-4 py-2 font-semibold text-white rounded-t-lg">
        📘 Game Quizizz
      </div>
      <div className="grid grid-cols-1 gap-4 p-4">
        <input
          name="quizizz_url"
          value={form.quizizz_url}
          onChange={handleChange}
          placeholder="Link Quizizz"
          className="input input-bordered w-full"
          type="url"
          required
        />
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

export default GameEdit;
