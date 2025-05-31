import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2"; // popup notif
import axios from "axios";
import HotelsChart from "./chart";
import HotelsFilterSidebar from "./Filter";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
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

const Hotel = () => {
  const navigate = useNavigate(); // hook untuk navigasi
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";

  const [isFilterVisible, setIsFilterVisible] = useState(false); // untuk menampilkan filter
  const [selectedGroup, setSelectedGroup] = useState(null); // untuk menampilkan data yang telah di filter di cards

  // untuk menampilkan data yang telah di filter di button filter
  const [filterDate, setFilterDate] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // untuk menampilkan data yang telah di filter di cards dan search

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
  useEffect(() => {
    fetchApartments();
  }, []);
  const fetchApartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/hotels");
      console.log("Fetched Data:", response.data); // Log the data
      setData(response.data);
    } catch (error) {
      console.error("Error fetching apartments data:", error);
    }
  };

  // filter button untuk hari
  const convertToISODate = (dateStr) => {
    if (!dateStr) return null; // hindari error jika null
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  // Ganti nama currentData lokal jadi paginatedData
  const paginatedData = currentData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(currentData.length / rowsPerPage);

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

          await axios.delete(`http://localhost:5000/hotels/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          fetchApartments();
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
    const exportData = exportSource.map((item, index) => ({
      No: index + 1,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hotel");

    XLSX.writeFile(workbook, "Hotel.xlsx");
  };

  const applyFilterAndSearch = () => {
    const filtered = data.filter((item) => {
      const matchDate =
        !filterDate ||
        moment(item.date, ["DD-MM-YYYY"]).format("DD-MM-YYYY") ===
          moment(filterDate, "YYYY-MM-DD").format("DD-MM-YYYY");

      const matchName = filterName
        ? item.name?.toLowerCase().includes(filterName.toLowerCase())
        : true;

      const matchAddress = filterAddress
        ? item.address?.toLowerCase().includes(filterAddress.toLowerCase())
        : true;

      const matchRegion = filterRegion
        ? item.region?.toLowerCase() === filterRegion.toLowerCase()
        : true;

      return matchDate && matchName && matchAddress && matchRegion;
    });

    const searchedData = filtered.filter((item) => {
      const matchesSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );
      const matchesGroup = selectedGroup
        ? item.group?.trim() === selectedGroup
        : true;

      return matchesSearch && matchesGroup;
    });

    // 🔽 Sorting by latest date
    const sorted = searchedData.slice().sort((a, b) => {
      const dateA = new Date(convertToISODate(a.date));
      const dateB = new Date(convertToISODate(b.date));

      const validA = !isNaN(dateA);
      const validB = !isNaN(dateB);

      if (validA && validB) {
        return dateB - dateA;
      } else if (validA) {
        return -1;
      } else if (validB) {
        return 1;
      } else {
        return b.id - a.id;
      }
    });

    setCurrentData(sorted);
    setCurrentPage(1);
  };

  // Panggil applyFilterAndSearch setiap filter/search berubah
  useEffect(() => {
    applyFilterAndSearch();
  }, [
    data,
    filterDate,
    filterName,
    filterAddress,
    filterRegion,
    searchText,
    selectedGroup,
  ]);

  //reset filter button
  const resetFilter = () => {
    setFilterDate("");
    setFilterName("");
    setFilterAddress("");
    setFilterRegion("");
    setFilteredData(data);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Filter Sidebar (button) */}
      {isFilterVisible && (
        <HotelsFilterSidebar
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterName={filterName}
          setFilterName={setFilterName}
          filterAddress={filterAddress}
          setFilterAddress={setFilterAddress}
          filterRegion={filterRegion}
          setFilterRegion={setFilterRegion}
          applyFilterAndSearch={applyFilterAndSearch}
          resetFilter={resetFilter}
          onClose={() => setIsFilterVisible(false)}
        />
      )}

      {/* Pie Chart */}
      <HotelsChart />

      {/* Table + Filter */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Hotel</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
          {/* Search Input */}
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Filter + Admin Buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-1/2 sm:justify-end">
            <button
              onClick={() => setIsFilterVisible(true)}
              className="btn btn-outline text-[#7B74DA] w-full sm:w-auto"
            >
              <FunnelIcon className="w-5 h-5 mr-1" />
              Filter
            </button>

            {(userRole === "admin" || userRole === "superadmin") && (
              <>
                <button
                  onClick={handleExportExcel}
                  className="btn btn-outline btn-success flex items-center w-full sm:w-auto"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                  Excel
                </button>

                <button
                  className={`btn btn-primary flex items-center w-full sm:w-auto text-sm ${
                    currentPath === "/app/Hotel/Create" ? "font-bold" : ""
                  }`}
                  onClick={() => navigate(`${basePath}/Hotel/Create`)}
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => (
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
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary mr-1"
                        onClick={() =>
                          navigate(`${basePath}/Hotel/Detail/${item.id}`)
                        }
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      {(userRole === "admin" || userRole === "superadmin") && (
                        <>
                          <button
                            className="btn btn-sm btn-warning mr-1"
                            onClick={() =>
                              navigate(`${basePath}/Hotel/Edit/${item.id}`)
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
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Tidak ada data
                  </td>
                </tr>
              )}
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

export default Hotel;
