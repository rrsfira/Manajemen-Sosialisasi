import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/educations");
      setEducations(response.data);
    } catch (error) {
      console.error("Gagal mengambil data materi:", error);
    }
  };

  const filteredData = educations.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

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

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Cari materi..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input input-bordered w-60"
          />

          {role === "admin" && (
            <button
              className="btn btn-primary flex items-center"
              onClick={() => navigate("/app/Education/Create")}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Tambah
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Nama Materi</th>
                <th className="text-center">File</th>
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
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() =>
                          navigate(`/app/Education/Details/${item.id}`)
                        }
                        className="btn btn-sm btn-info"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      {role === "admin" && (
                        <>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              navigate(`/app/Education/Edit/${item.id}`)
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
      </div>
    </div>
  );
};

export default Education;
