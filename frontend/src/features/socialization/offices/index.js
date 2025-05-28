import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2"; // popup notif
import axios from "axios";
import OfficesChart from "./chart";
import {
  DocumentArrowDownIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const Office = () => {
  const navigate = useNavigate(); // hook untuk navigasi
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  useEffect(() => {
    fetchoffices();
  }, []);
  const fetchoffices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/offices");
      console.log("Fetched Data:", response.data); // Log the data
      setData(response.data);
    } catch (error) {
      console.error("Error fetching offices data:", error);
    }
  };

  // Filtering data based on the search text
  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );
  // filter button untuk hari
  const convertToISODate = (dateStr) => {
    if (!dateStr) return null; // hindari error jika null
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };
  const sortedData = filteredData.slice().sort((a, b) => {
    const dateA = new Date(convertToISODate(a.date));
    const dateB = new Date(convertToISODate(b.date));

    const validA = !isNaN(dateA);
    const validB = !isNaN(dateB);

    if (validA && validB) {
      return dateB - dateA;
    } else if (validA) {
      return -1; // valid tanggal dulu
    } else if (validB) {
      return 1;
    } else {
      return b.id - a.id;
    }
  });

  const currentData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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

          await axios.delete(`http://localhost:5000/offices/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          fetchoffices();
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

  //export excel
  const handleExportExcel = () => {
    const exportSource = filteredData.length > 0 ? filteredData : data;
    const exportData = exportSource.map((item) => ({
      ID: item.id,
      Nama: item.name,
      Kegiatan: item.activity,
      Wilayah: item.region,
      Kecamatan: item.subdistrict,
      Alamat: item.address,
      Tanggal: item.date,
      "Ketua Tim": item.leader,
      SK: item.suratK,
      Perempuan: item.gender_woman,
      Laki: item.gender_man,
      "Umur 19 - 44 Tahun": item.age_19to44years,
      "Umur 44 Tahun Keatas": item.age_over4years,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Office");

    XLSX.writeFile(workbook, "Office.xlsx");
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Pie Chart */}
      <OfficesChart />

      {/* Table + Filter */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Perkantoran</h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full sm:max-w-xs"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
            <button className="btn btn-outline btn-info flex items-center justify-center text-sm h-10 w-full sm:w-auto">
              <FunnelIcon className="w-5 h-5 mr-1" />
              Filter
            </button>

            {role === "admin" && (
              <>
                <button
                  onClick={handleExportExcel}
                  className="btn btn-outline btn-success flex items-center justify-center text-sm h-10 w-full sm:w-auto"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                  Excel
                </button>

                <button
                  className={`btn btn-primary flex items-center justify-center text-sm h-10 w-full sm:w-auto ${currentPath === "/app/Office/Create"
                      ? "font-bold text-primary"
                      : ""
                    }`}
                  onClick={() => navigate("/app/Office/Create")}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Tambah
                </button>
              </>
            )}
          </div>
        </div>


        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Nama</th>
                <th className="text-center">Alamat</th>
                <th className="text-center">Wilayah</th>
                <th className="text-center">Kecamatan</th>
                <th className="text-center">SK</th>
                <th className="text-center">Tgl Kegiatan</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => {
                console.log(item); // Add this to see the structure of the item
                return (
                  <tr key={idx}>
                    <td className="text-center">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>
                    <td className="text-center">
                      {item.name || "Tidak ada data"}
                    </td>
                    <td className="text-center">
                      {item.address || "Tidak ada data"}
                    </td>
                    <td className="text-center">
                      {item.region || "Tidak ada data"}
                    </td>
                    <td className="text-center">
                      {item.subdistrict || "Tidak ada data"}
                    </td>
                    <td className="text-center">
                      {item.suratK ? (
                        <CheckCircleIcon className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-error mx-auto" />
                      )}
                    </td>
                    <td className="text-center">
                      {item.date || "Tidak ada data"}
                    </td>
                    <td className="text-center flex justify-center gap-1">
                      <button
                        className="btn btn-sm btn-primary mr-1"
                        onClick={() =>
                          navigate(`/app/Office/Detail/${item.id}`)
                        }
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      {role === "admin" && (
                        <>
                          <button
                            className="btn btn-sm btn-warning mr-1"
                            onClick={() =>
                              navigate(`/app/Office/Edit/${item.id}`)
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 flex-wrap justify-center overflow-x-auto max-w-full px-2">
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
                  className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline"
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

export default Office;
