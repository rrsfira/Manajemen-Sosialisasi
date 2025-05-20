import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
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

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      contact: form.contact,
      role: form.role, // "admin" atau "superadmin", tergantung nilai default/frontend
    };

    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registrasi berhasil!");
      navigate("/login");
    } else {
      alert(data.message || "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Logo dan Info */}
      <div className="text-center mb-8">
        <img
          src="/logo192.png"
          alt="Logo"
          className="w-24 h-24 mx-auto drop-shadow-lg"
        />
        <h1 className="text-3xl font-bold text-[#ED2025] mt-4">
          Shafira<span className="text-[#2A3382]">Hub</span>
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="max-w-3xl mx-auto space-y-6">
        {/* Informasi Akun */}
        <div className="border rounded-lg shadow-sm">
          <div className="bg-gray-100 px-4 py-2 font-semibold text-lg flex items-center gap-2">
            <span className="text-blue-600">📘</span> Informasi Akun
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded bg-[#FFEFE7]"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded bg-[#FFEFE7]"
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded bg-[#FFEFE7]"
              />
            </div>
            <div>
              <label className="block mb-1">Nomor Kontak</label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded bg-[#FFEFE7]"
              />
            </div>
          </div>
        </div>

        {/* Tombol */}
        <button
          type="submit"
          className="w-full py-2 rounded-md text-white bg-[#F36621]"
        >
          Daftar
        </button>

        <div className="text-center text-sm mt-2">
          <p>
            Sudah punya akun?{" "}
            <span
              className="text-[#F36621] cursor-pointer hover:underline font-semibold"
              onClick={() => navigate("/login")}
            >
              Masuk
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
