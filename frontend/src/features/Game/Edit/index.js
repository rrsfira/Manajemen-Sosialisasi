import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const GameEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState({ name: "" });
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";

  const [form, setForm] = useState({
    quizizz_url: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/games/${id}`);
        setForm({ quizizz_url: res.data.quizizz_url || "" });
        setGame({ name: res.data.name || "" }); // 👈 tambahkan ini
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const idToPathMap = {
    1: `${basePath}/GameTK`,
    2: `${basePath}/GameSD`,
    3: `${basePath}/GameSMP`,
    4: `${basePath}/GameSMA`,
    5: `${basePath}/GameMasyarakat`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:5000/games/${id}`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Data berhasil disimpan");

      // Navigate ke halaman asal
      const targetPath =
        idToPathMap[parseInt(id)] || `${basePath}/GameMasyarakat`;
      navigate(targetPath);
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
          {game.name && ` ${game.name}`}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <div className="border rounded-lg shadow-sm">
          <div className="bg-secondary px-4 py-2 font-semibold text-white">
            📘 Game Quizizz
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <input
              name="quizizz_url"
              value={form.quizizz_url}
              onChange={handleChange}
              placeholder="Link Quizizz"
              className="input"
              type="url"
              required
            />
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

export default GameEdit;
