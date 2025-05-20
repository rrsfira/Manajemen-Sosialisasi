import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Pie } from "@ant-design/plots"; // drilldown diagram
import * as XLSX from "xlsx"; //excel
import Swal from "sweetalert2"; // popup notif
import EducationFilterSidebar from "./Filter"; // import button filter
import {
  DocumentArrowDownIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import EducationUnitsChart from "../educationUnits/chart";

const EducationUnits = () => {
  const navigate = useNavigate(); // hook untuk navigasi
  const [role, setRole] = useState(""); // untuk memberi hak role
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
  // drilldown diagram
  const [drilldownData, setDrilldownData] = useState([]); // untuk menampilkan data yang telah di filter di diagram
  const [selectedRegion, setSelectedRegion] = useState(null); // untuk menampilkan data yang telah di filter di diagram
  const [pieChartData, setPieChartData] = useState([]); // untuk menampilkan data yang telah di filter di diagram

  const [data, setData] = useState([]); // state untuk data
  // untuk menampilkan data dari backend
  useEffect(() => {
    fetchEducationUnits();
  }, []);
  const fetchEducationUnits = async () => {
    try {
      const response = await axios.get("http://localhost:5000/education_units");
      console.log("Fetched Data:", response.data); // Log the data
      setData(response.data);
      processPieData(response.data);
    } catch (error) {
      console.error("Error fetching education unit data:", error);
    }
  };

  // popup notifikasi hapus data
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/education_units/${id}`);
          fetchEducationUnits(); // refresh data
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

  // untuk menampilkan data dalam bentuk pie chart
  const fetchDrilldownData = async (region) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/education_units/region/${region}`
      );
      console.log("Fetched Drilldown Data:", response.data); // Periksa struktur data yang diterima

      if (!response.data || response.data.length === 0) {
        console.log("No data received for drilldown.");
        return;
      }
      const groupedBySubdistrict = response.data.reduce((acc, curr) => {
        const key = curr.subdistrict || "Tidak diketahui"; // Pastikan subdistrict ada
        const found = acc.find((item) => item.type === key);
        if (found) {
          found.value += 1;
        } else {
          acc.push({ type: key, value: 1 });
        }
        return acc;
      }, []);

      console.log("Grouped by Subdistrict:", groupedBySubdistrict); // Periksa data yang sudah digrupkan
      setDrilldownData(groupedBySubdistrict); // Set data drilldown dengan data yang sudah digrupkan
    } catch (error) {
      console.error("Error fetching drilldown data:", error);
    }
  };
  // untuk menampilkan data dalam bentuk bar chart
  const handleBackFromDrilldown = () => {
    setSelectedRegion(null);
    processPieData(data);
  };
  const processPieData = (inputData) => {
    const summary = inputData.reduce((acc, curr) => {
      const key = curr.region || "Tidak diketahui"; // pastikan key sesuai dengan field yang benar
      const found = acc.find((item) => item.type === key);
      if (found) {
        found.value += 1;
      } else {
        acc.push({ type: key, value: 1 });
      }
      return acc;
    }, []);
    console.log("Processed Pie Data:", summary); // Tambahkan log untuk debug
    setPieChartData(summary);
  };
  const pieConfig = {
    appendPadding: 10,
    data: pieChartData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    label: {
      type: "spider",
      content: "{name} ({percentage})",
    },
    interactions: [{ type: "element-active" }],
    tooltip: {
      formatter: (datum) => ({ name: datum.type, value: datum.value }),
    },
    onReady: (plot) => {
      plot.on("element:click", (e) => {
        const region = e.data?.data?.type;
        if (region) {
          fetchDrilldownData(region);
          setSelectedRegion(region);
        }
      });
    },
  };

  // fungsi untuk klik summary card
  const handleGroupCardClick = (group) => {
    setSelectedGroup(group);
  };
  // jika filter menggunakan button maka filter menggunakan search akan nonaktif
  const activeData = filteredData.length > 0 ? filteredData : data;
  // filter menggunakan search dan cards
  const searchedData = activeData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesGroup = selectedGroup
      ? item.group?.trim() === selectedGroup
      : true;
    return matchesSearch && matchesGroup;
  });

  // fungsi untuk mengubah data menjadi format yang diinginkan
  const currentData = searchedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(searchedData.length / rowsPerPage);

  // Gunakan useEffect agar setRole dipanggil sekali saat komponen mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      const normalized = storedRole.trim().toLowerCase();
      setRole(normalized);
    }
  }, []);


  //export excel
  const handleExportExcel = () => {
    const exportSource = filteredData.length > 0 ? filteredData : data;

    // Ambil role dari localStorage
    const storedRole = localStorage.getItem("role")?.trim().toLowerCase();

    let exportData = [];

    if (storedRole === "admin") {
      exportData = exportSource.map((item) => ({
        ID: item.id,
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
    } else {
      exportData = exportSource.map((item) => ({
        Nama: item.name,
        Alamat: item.address,
        Wilayah: item.region,
        Kecamatan: item.subdistrict,
        Tanggal: item.date,
      }));
    }

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

  // filter button untuk hari
  const convertToISODate = (dateStr) => {
    if (!dateStr) return null; // hindari error jika null
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  //filter button
  const applyFilter = () => {
    const filtered = data.filter((item) => {
      const matchDate = filterDate
        ? convertToISODate(item.date) === filterDate
        : true;
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
    setFilteredData(filtered);
    setCurrentPage(1);
  };

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
          applyFilter={applyFilter}
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

      {/* Pie Chart */}
   
        <EducationUnitsChart />

      {/* Drilldown Table */}
      {selectedRegion && (
        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Daftar Satuan Pendidikan di Kecamatan {selectedRegion}
          </h3>
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
                {drilldownData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td className="text-center">{item.name}</td>
                    <td className="text-center">{item.address}</td>
                    <td className="text-center">{item.region}</td>
                    <td className="text-center">{item.subdistrict}</td>
                    <td className="text-center">
                      {item.suratK ? (
                        <CheckCircleIcon className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-error mx-auto" />
                      )}
                    </td>
                    <td className="text-center">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Satuan Pendidikan</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex gap-2 w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              onClick={handleReset}
              className="btn btn-secondary whitespace-nowrap"
            >
              Reset Search
            </button>
          </div>
          <div className="flex gap-2 w-full sm:w-1/3 justify-end">
            <button
              onClick={() => setIsFilterVisible(true)}
              className="btn btn-outline btn-[#7B74DA]"
            >
              <FunnelIcon className="w-5 h-5 mr-1" />
              Filter
            </button>
            <button
              onClick={handleExportExcel}
              className="btn btn-outline btn-success"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
              Excel
            </button>
            {role === "admin" && (
              <button
                className={`btn btn-primary flex items-center text-lg cursor-pointer ${
                  currentPath === "/app/EducationUnitCreate"
                    ? "font-bold text-primary"
                    : ""
                }`}
                onClick={() => navigate("/app/EducationUnit/Create")} // navigasi saat diklik
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Tambah
              </button>
            )}
          </div>
        </div>

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
              {currentData.map((item, idx) => (
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
                        navigate(`/app/EducationUnit/Detail/${item.id}`)
                      }
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {role === "admin" && (
                      <>
                        <button
                          className="btn btn-sm btn-warning mr-1"
                          onClick={() =>
                            navigate(`/app/EducationUnit/Edit/${item.id}`)
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
              ))}
            </tbody>
          </table>
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

export default EducationUnits;
