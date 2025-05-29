import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitleCard from "../../../components/Cards/TitleCard";
import Swal from 'sweetalert2';

const AdminEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ambil id dari URL

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    role: "admin",
  });

  // 🔍 Ambil data user berdasarkan ID saat pertama kali halaman dimuat
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/${id}`);
        const data = await response.json();

        if (response.ok) {
          setForm({
            ...form,
            name: data.name,
            email: data.email,
            contact: data.contact,
            role: data.role,
            password: "", // password tidak ditampilkan, user bisa ganti jika ingin
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: data.message || "User tidak ditemukan",
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Swal.fire({
          icon: "error",
          title: "Kesalahan",
          text: "Tidak bisa mengambil data user.",
          confirmButtonColor: "#d33",
        });
      }
    };

    fetchUserById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📝 Proses update data
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data admin berhasil diperbarui.",
          confirmButtonColor: "#23286B",
        }).then(() => {
        navigate("/spr/SuperAdmin/DataAdmin");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: errorData.message || "Gagal memperbarui data.",
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
    <TitleCard title="Edit Admin" topMargin="mt-2">
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block mb-2 text-sm font-medium">
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

          {/* Role */}
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
            Password (kosongkan jika tidak ingin mengubah)
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Masukkan password baru"
            className="w-full px-4 py-3 rounded-lg border-base-100 bg-base-100 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-secondary text-base-100 font-semibold px-6 py-3 rounded-lg hover:bg-primary transition"
          >
            Update
          </button>
        </div>
      </form>
    </TitleCard>
  );
};

export default AdminEdit;
