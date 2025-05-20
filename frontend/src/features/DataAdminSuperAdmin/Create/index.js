import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import Swal from 'sweetalert2';

const AdminCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    role: "admin",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  const payload = { ...form };

  try {
    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Admin baru telah ditambahkan.",
        confirmButtonColor: "#23286B",
      }).then(() => {
        navigate("/spr/SuperAdmin/DataAdmin");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: data.message || "Registrasi gagal. Coba lagi.",
        confirmButtonColor: "#d33",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Kesalahan",
      text: "Terjadi kesalahan saat menghubungi server.",
      confirmButtonColor: "#d33",
    });
  }
};

  return (
    <TitleCard title="Tabel Admin" topMargin="mt-2">
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block mb-2 text-sm font-medium ">
              Username
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Masukkan username"
              className="w-full px-4 py-3 rounded-lg border border-base-100 bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#F36621]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Masukkan email"
              className="w-full px-4 py-3 rounded-lg border border-base-100 bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#F36621]"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Kontak
            </label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
              placeholder="Masukkan nomor kontak"
              className="w-full px-4 py-3 rounded-lg border border-base-100 bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#F36621]"
            />
          </div>

          {/* Role (optional) */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-base-100 bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#F36621]"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Masukkan password"
            className="w-full px-4 py-3 rounded-lg border-base-100 bg-base-100 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-secondary text-base-100 font-semibold px-6 py-3 rounded-lg hover:bg-primary transition"
          >
            Kirim
          </button>
        </div>
      </form>
    </TitleCard>
  );
};

export default AdminCreate;
