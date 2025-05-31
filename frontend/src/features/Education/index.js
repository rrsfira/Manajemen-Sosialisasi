import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import {
  EyeIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";

  const token = localStorage.getItem("token");
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);

      // Cek apakah token masih berlaku
      const isTokenValid = decoded.exp * 1000 > Date.now();
      if (isTokenValid) {
        userRole = decoded.role; // Harusnya 'admin' atau 'superadmin'
      }
    } catch (error) {
      console.error("Invalid token");
    }
  }
  const fetchEducations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/educations");
      setEducations(response.data);
    } catch (error) {
      console.error("Gagal mengambil data materi:", error);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const filteredData = educations.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // popup notifikasi hapus data
  const handleDelete = async (id) => {
    const isDarkMode = document.documentElement.classList.contains("dark");

    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      willOpen: () => {
        const popup = document.querySelector(".swal2-popup");
        if (document.documentElement.classList.contains("dark")) {
          popup.classList.add("swal2-dark");
          popup
            .querySelector(".swal2-title")
            ?.classList.add("swal2-title-dark");
          popup
            .querySelector(".swal2-html-container")
            ?.classList.add("swal2-content-dark");
          popup
            .querySelector(".swal2-confirm")
            ?.classList.add("swal2-confirm-dark");
          popup
            .querySelector(".swal2-cancel")
            ?.classList.add("swal2-cancel-dark");
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");

          await axios.delete(`http://localhost:5000/educations/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          fetchEducations();
          Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus data.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Materi</h2>

        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
          <input
            type="text"
            placeholder="Cari materi..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input input-bordered w-full sm:w-60"
          />

          {(userRole === "admin" || userRole === "superadmin") && (
            <button
              className="btn btn-primary flex items-center justify-center sm:justify-start"
              onClick={() => navigate(`${basePath}/Education/Create`)}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Tambah
            </button>
          )}
        </div>

        {/* Tabel desktop dan tablet (sm ke atas) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="table w-full min-w-[600px] text-sm sm:text-base">
            <thead>
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Nama Materi</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => (
                <tr key={item.id}>
                  <td className="text-center">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  <td className="text-center">{item.name}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() =>
                          navigate(`${basePath}/Education/Details/${item.id}`)
                        }
                        className="btn btn-sm btn-info"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                       {(userRole === "admin" || userRole === "superadmin") && (
                        <>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              navigate(`${basePath}/Education/Edit/${item.id}`)
                            }
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(item.id)}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card list mobile (hidden di sm ke atas) */}
        <div className="sm:hidden space-y-4">
          {currentData.length === 0 && (
            <div className="text-center text-gray-400">Tidak ada data</div>
          )}
          {currentData.map((item, idx) => (
            <div
              key={item.id}
              className="bg-base-100 p-4 rounded-lg shadow-md flex flex-col space-y-2"
            >
              <div className="font-semibold text-base">
                {idx + 1}. {item.name}
              </div>
              <div>
                File:{" "}
                {item.materi ? (
                  <a
                    href={`http://localhost:5000/uploads/materi/${item.materi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Download File
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Tidak ada</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(`${basePath}/Education/Details/${item.id}`)
                  }
                  className="btn btn-sm btn-info flex-1"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
                {(userRole === "admin" || userRole === "superadmin") && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`${basePath}/Education/Edit/${item.id}`)
                      }
                      className="btn btn-sm btn-warning flex-1"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-sm btn-error flex-1"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="btn btn-sm btn-outline"
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}

            {Array.from({ length: 5 }, (_, i) => {
              const page = currentPage - 2 + i;
              if (page < 1 || page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn btn-sm ${
                    page === currentPage ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="btn btn-sm btn-outline"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Education;
