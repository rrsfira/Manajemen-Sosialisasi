import React, { useEffect, useState } from "react"; //menyimpan dan mengatur state lokal
import { useNavigate, useLocation } from "react-router-dom"; //menggunakan hook untuk mengakses alamat URL
import axios from "axios"; //menggunakan axios untuk mengirimkan request ke server
import * as XLSX from "xlsx"; //excel
import Swal from "sweetalert2"; // popup notif
import EducationFilterSidebar from "./Filter"; // import button filter
import EducationUnitsChart from "../educationUnits/chart"; // import drilldown chart
import moment from "moment";
import { jwtDecode } from 'jwt-decode';
import {
  DocumentArrowDownIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"; // import icon

const EducationUnits = () => {
  const navigate = useNavigate(); // hook untuk navigasi
  const location = useLocation(); // untuk mendapatkan lokasi
  const currentPath = location.pathname; // untuk mendapatkan path lokasi
  const [currentPage, setCurrentPage] = useState(1); // untuk pagination
  const [rowsPerPage] = useState(5); // untuk berapa banyak data yang ditampilkan per halaman
  //filter cards dan search
  const [searchText, setSearchText] = useState(""); // state lokal bernama searchtext
  const [isFilterVisible, setIsFilterVisible] = useState(false); // untuk menampilkan filter
  const [selectedGroup, setSelectedGroup] = useState(null); // untuk menampilkan data yang telah di filter di cards
  const [filteredData, setFilteredData] = useState([]); // untuk menampilkan data yang telah di filter di cards dan search
  // untuk menampilkan data yang telah di filter di button filter
  const [filterDate, setFilterDate] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [data, setData] = useState([]); // state untuk data
  const [currentData, setCurrentData] = useState([]);
  const basePath = currentPath.startsWith("/spr") ? "/spr" : "/app";

  // untuk menampilkan data dari backend
  useEffect(() => {
    fetchEducationUnits();
  }, []);
  const fetchEducationUnits = async () => {
    try {
      const response = await axios.get("http://localhost:5000/education_units");
      console.log("Fetched Data:", response.data); // Log the data
      setData(response.data);
    } catch (error) {
      console.error("Error fetching education unit data:", error);
    }
  };

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

          await axios.delete(`http://localhost:5000/education_units/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          fetchEducationUnits();
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

  // fungsi untuk klik summary card
  const handleGroupCardClick = (group) => {
    setSelectedGroup((prevGroup) => (prevGroup === group ? null : group));
  };

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

  //export excel
  const handleExportExcel = () => {
    const exportSource = filteredData.length > 0 ? filteredData : data;
    const exportData = exportSource.map((item) => ({
      No: data.indexOf(item) + 1,
      Nama: item.name,
      Jenjang: item.group,
      Kegiatan: item.activity,
      Instansi: item.instance,
      Wilayah: item.region,
      Kecamatan: item.subdistrict,
      Alamat: item.address,
      Tanggal: item.date,
      "Ketua Tim": item.leader,
      SK: item.suratK,
      Perempuan: item.gender_woman,
      Laki: item.gender_man,
      "Umur Dibawah 6 Tahun": item.age_under6years,
      "Umur 6 - 10 Tahun": item.age_6to10years,
      "Umur 11 - 18 Tahun": item.age_11to18years,
      "Umur 44 Tahun Keatas": item.age_over4years,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Satuan Pendidikan");

    XLSX.writeFile(workbook, "SatuanPendidikan.xlsx");
  };

  // Buat summary jenjang (hitung sekali saja)
  const targetGroups = ["TK", "SD/MI", "SMP/MTS", "SMA/SMK/MA"];
  const groupSummary = {
    TK: 0,
    "SD/MI": 0,
    "SMP/MTS": 0,
    "SMA/SMK/MA": 0,
  };

  data.forEach((d) => {
    const group = d.group?.trim(); // aman untuk null/undefined dan spasi

    if (targetGroups.includes(group)) {
      groupSummary[group]++;
    }
  });

  // Tampilkan hasil
  console.log("Jumlah data per group jenjang:");
  console.log(`TK: ${groupSummary["TK"]}`);
  console.log(`SD/MI: ${groupSummary["SD/MI"]}`);
  console.log(`SMP/MTS: ${groupSummary["SMP/MTS"]}`);
  console.log(`SMA/SMK/MA: ${groupSummary["SMA/SMK/MA"]}`);

  //warna cards
  const colorVariants = [
    "bg-info",
    "bg-success",
    "bg-warning",
    "bg-orange-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-gray-500",
  ];
  //button reset filter sebelah search untuk reset cards dan search
  const handleReset = () => {
    setSearchText("");
    setSelectedGroup(null);
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
        <EducationFilterSidebar
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

      {/* Top Summary Cards */}
      <div className="w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(groupSummary).map(([group, jumlah], idx) => {
            return (
              <div
                key={group}
                className={`card ${colorVariants[idx]} text-white shadow-xl cursor-pointer`}
                onClick={() => handleGroupCardClick(group)}
              >
                <div className="card-body">
                  <h2 className="text-3xl font-bold">{jumlah}</h2>
                  <p>Jumlah data {group}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drilldown Chart */}
      <EducationUnitsChart />

      {/* Table */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Satuan Pendidikan</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 w-full">
          {/* Search input (kiri) */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              onClick={handleReset}
              className="btn btn-secondary whitespace-nowrap w-full sm:w-auto"
            >
              Reset Search
            </button>
          </div>

          {/* Action Buttons (kanan) */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              <button
                onClick={() => setIsFilterVisible(true)}
                className="btn btn-outline text-[#7B74DA] flex items-center whitespace-nowrap w-full sm:w-auto"
              >
                <FunnelIcon className="w-5 h-5 mr-1" />
                Filter
              </button>
             {(userRole === "admin" || userRole === "superadmin") && (
                <>
                  <button
                    onClick={handleExportExcel}
                    className="btn btn-outline btn-success flex items-center whitespace-nowrap w-full sm:w-auto"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                    Excel
                  </button>
                  <button
                    className={`btn btn-primary flex items-center text-lg whitespace-nowrap w-full sm:w-auto ${
                      currentPath === "/app/EducationUnitCreate"
                        ? "font-bold text-primary"
                        : ""
                    }`}
                    onClick={() => navigate(`${basePath}/EducationUnit/Create`)}
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Tambah
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* table */}
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
                          navigate(
                            `${basePath}/EducationUnit/Detail/${item.id}`
                          )
                        }
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    {(userRole === "admin" || userRole === "superadmin") && (
                        <>
                          <button
                            className="btn btn-sm btn-warning mr-1"
                            onClick={() =>
                              navigate(
                                `${basePath}/EducationUnit/Edit/${item.id}`
                              )
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

        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            ← Prev
          </button>

          {/* Page Numbers - scrollable on small screens */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full px-1 sm:justify-center flex-nowrap">
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

export default EducationUnits;
