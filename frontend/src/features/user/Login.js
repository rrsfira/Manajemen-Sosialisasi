import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const expiresAt = Date.now() + 3600 * 1000;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("expiresAt", expiresAt);

      if (data.role === "admin") navigate("/adm/dashboardAdmin");
      else if (data.role === "superadmin") navigate("/spr/Dashboard");
      else navigate("/user");
    } else {
      if (data.message === "Invalid password") {
        alert("Password salah, tapi akun terdaftar.");
      } else if (data.message === "User not found") {
        alert("Email tidak ditemukan.");
      } else {
        alert(data.message || "Login gagal");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-base-200">
      {/* Kiri (Desktop only) */}
      <div className="hidden md:flex md:w-1/2 bg-base-300 justify-center items-center p-10">
        <div className="text-center">
          <img
            src="/logo192.png"
            alt="Logo"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto drop-shadow-lg"
          />
          <h1 className="text-2xl font-semibold text-primary mt-4">
            Siaga <span className="text-secondary font-bold">Surabaya</span>
          </h1>
          <p className="mt-2 text-primary text-sm md:text-base">
            Bidang Pencegahan & Kesiapsiagaan BPDB Kota Surabaya
          </p>
        </div>
      </div>

      {/* Kanan (Form) */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Masuk Sebagai Admin
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-[#FFEFE7] text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-[#FFEFE7] text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right mt-1">
                <a
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Lupa Password?
                </a>
              </div>
            </div>

            <button
              className="w-full py-2 rounded-md text-white bg-primary hover:bg-orange-600 transition"
              type="submit"
            >
              Masuk
            </button>

            <div className="text-center text-sm">
              <p>
                Belum memiliki akun?{" "}
                <span
                  className="text-primary cursor-pointer hover:underline font-semibold"
                  onClick={() => navigate("/visitor")}
                >
                  Masuk Sebagai Visitor
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
