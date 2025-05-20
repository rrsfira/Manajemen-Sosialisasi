import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import * as XLSX from "xlsx";
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import HealthFacilitiesChart from "./chart/index.js";

const HealthFacility = () => {
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [healthFacilitiesCount, setHealthFacilitiesCount] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [role, setRole] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesGroup = selectedGroup
      ? item.category?.toLowerCase().trim() === selectedGroup
      : true;
    return matchesSearch && matchesGroup;
  });

  const handleReset = () => {
    setSearchText("");
    setSelectedGroup(null);
  };
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    // Fetch health facilities data
    axios
      .get("http://localhost:5000/health_facilities")
      .then((response) => {
        setData(response.data);
        setHealthFacilities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching health facilities data:", error);
      });

    // Fetch health facilities count (Puskesmas, Klinik, Rumah Sakit)
    axios
      .get("http://localhost:5000/health_facilities/count")
      .then((response) => {
        setHealthFacilitiesCount(response.data);
        const { puskesmas, klinik, rumah_sakit } = response.data;
        setPieData([
          { type: "Puskesmas", value: puskesmas },
          { type: "Klinik", value: klinik },
          { type: "Rumah Sakit", value: rumah_sakit },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching health facilities count:", error);
      });
  }, []);

  
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(healthFacilities);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fasilitas Kesehatan");
    XLSX.writeFile(workbook, "FasilitasKesehatan.xlsx");
  };

  const targetGroups = ["puskesmas", "klinik", "rumah sakit"];
  const groupSummary = {
    puskesmas: 0,
    klinik: 0,
    "rumah sakit": 0,
  };

  data.forEach((d) => {
    const group = d.category?.trim().toLowerCase(); // pastikan lowercase // aman untuk null/undefined dan spasi

    if (targetGroups.includes(group)) {
      groupSummary[group]++;
    }
  });

  // Tampilkan hasil
  console.log("Jumlah data per kategori fasilitas kesehatan:");
  console.log(`puskesmas: ${groupSummary["puskesmas"]}`);
  console.log(`klinik: ${groupSummary["klinik"]}`);
  console.log(`rumah sakit: ${groupSummary["rumah sakit"]}`);

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
  // fungsi untuk klik summary card
  const handleGroupCardClick = (group) => {
    setSelectedGroup(group);
  };

  return (
    
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Top Summary Cards */}
      <div className="w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(groupSummary).map(([group, jumlah], idx) => (
            <div
              key={group}
              className={`card ${colorVariants[idx]} text-white shadow-xl cursor-pointer`}
              onClick={() => handleGroupCardClick(group)}
            >
              <div className="card-body">
                <h2 className="text-3xl font-bold">{jumlah}</h2>
                <p>
                  Jumlah data {group.charAt(0).toUpperCase() + group.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {/* Pie Chart */}
        <HealthFacilitiesChart />

      {/* Table + Filter */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Data Tabel Fasilitas Kesehatan
        </h2>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
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
              <button className="btn btn-primary flex items-center">
                <PlusIcon className="w-4 h-4 mr-1" />
                Tambah
              </button>
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
                    {item.SK ? (
                      <CheckCircleIcon className="w-5 h-5 text-success mx-auto" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-error mx-auto" />
                    )}
                  </td>
                  <td className="text-center">
                    {item.time
                      ? new Date(item.time).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Tidak ada data"}
                  </td>
                  <td className="text-center flex justify-center gap-1">
                    <button className="btn btn-sm btn-primary">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {role === "admin" && (
                      <>
                        <button className="btn btn-sm btn-warning mr-1">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button className="btn btn-sm btn-error">
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

export default HealthFacility;
