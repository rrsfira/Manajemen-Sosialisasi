import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const user = res.data;
        setName(user.name);
        setEmail(user.email);
        setContact(user.contact || "");
        setOriginalData({
          name: user.name,
          email: user.email,
          contact: user.contact || "",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
        Swal.fire(
          "Gagal",
          "Gagal memuat profil. Silakan login ulang.",
          "error"
        );
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cek apakah ada perubahan data sebelum submit
    if (
      name === originalData.name &&
      email === originalData.email &&
      contact === originalData.contact
    ) {
      Swal.fire("Info", "Silahkan Edit Profile", "info");
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .put(
        `http://localhost:5000/users`,
        { name, email, contact },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setOriginalData({ name, email, contact });
        setIsEditing(false);
        Swal.fire("Berhasil", "Profil berhasil diperbarui!", "success");
      })
      .catch((err) => {
        console.error("Update failed", err);
        Swal.fire("Gagal", "Gagal memperbarui profil", "error");
      });
  };

  const handleCancel = () => {
    setName(originalData.name);
    setEmail(originalData.email);
    setContact(originalData.contact);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-base-100 px-4">
      {/* Logo dan Judul di Atas */}
      <div className="text-center py-8">
        <img src="/logo192.png" alt="Logo" className="w-24 h-24 mx-auto" />
        <h1 className="text-3xl font-bold text-[#ED2025] mt-4">
          Siaga<span className="text-[#2A3382]"> Surabaya</span>
        </h1>
      </div>

      {/* Form di Tengah */}
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-transparent p-6 w-full max-w-3xl"
        >
          {/* Nama */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">
              Nama Anda
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Kontak */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Kontak</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="btn bg-[#2F2FAF] text-white px-8"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn bg-gray-400 text-white px-8"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn bg-[#2F2FAF] text-white px-8"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
