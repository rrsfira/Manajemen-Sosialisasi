import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // User role, untuk cek apakah superadmin (ambil dari user data)
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setRole(res.data.role); // asumsi data user ada property role
        setName(res.data.name);
        setEmail(res.data.email);
        setContact(res.data.contact || "");
      })
      .catch(() => {
        Swal.fire(
          "Gagal",
          "Gagal memuat profil. Silakan login ulang.",
          "error"
        );
      });
  }, []);

  // Reset form ke original user data
  const resetForm = () => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setContact(user.contact || "");
    setNewPassword("");
    setShowChangePassword(false);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const profileChanged =
      name !== user.name ||
      email !== user.email ||
      contact !== (user.contact || "");

    const passwordChanged =
      showChangePassword &&
      oldPassword.trim() !== "" &&
      newPassword.trim() !== "";

    if (!profileChanged && !passwordChanged) {
      Swal.fire(
        "Info",
        "Silakan ubah data",
        "info"
      );
      return;
    }

    const token = localStorage.getItem("token");
    const updateData = { name, email, contact };

    axios
      .put("http://localhost:5000/users", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        if (passwordChanged && role === "superadmin") {
          // Kirim password lama dan baru untuk validasi
          return axios.put(
            "http://localhost:5000/users/password",
            { oldPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      })
      .then(() => {
        Swal.fire("Berhasil", "Profil berhasil diperbarui!", "success");
        setIsEditing(false);
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
        // reload user data
        return axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        setUser(res.data);
        resetForm();
      })
      .catch((err) => {
        console.error(err);
        let msg = "Gagal memperbarui profil atau password";
        if (err.response && err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        }
        Swal.fire("Gagal", msg, "error");
      });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-base-100 px-4">
      <div className="text-center py-8">
        <img src="/logo192.png" alt="Logo" className="w-24 h-24 mx-auto" />
        <h1 className="text-3xl font-bold text-[#ED2025] mt-4">
          Siaga<span className="text-[#2A3382]"> Surabaya</span>
        </h1>
      </div>

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
              required
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
              required
            />
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Contact</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Tombol Ganti Password hanya muncul jika isEditing dan role superadmin */}
          {isEditing && role === "superadmin" && (
            <div className="mb-4">
              {!showChangePassword ? (
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => setShowChangePassword(true)}
                >
                  Ganti Password
                </button>
              ) : (
                <>
                  <label className="block text-gray-700 text-sm mb-1 mt-4">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full mb-3"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan password lama"
                    required
                  />

                  <label className="block text-gray-700 text-sm mb-1 mt-4">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                    required
                  />
                </>
              )}
            </div>
          )}

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
