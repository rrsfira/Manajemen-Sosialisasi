import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import * as XLSX from "xlsx";
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
import axios from "axios";
import UrbanVillageChart from "./chart/index";

const UrbanVillage = () => {
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [healthFacilitiesCount, setHealthFacilitiesCount] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  // Filtering data based on the search text
  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    // Fetch mall data
    axios
      .get("http://localhost:5000/urban_village")
      .then((response) => {
        setData(response.data);
        setHealthFacilities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Urban Village data:", error);
      });
  }, []);

  const openFilter = () => setIsFilterVisible(true);
  const closeFilter = () => setIsFilterVisible(false);

  const handleViewDetails = (id) => {
    console.log("View details for ID:", id);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UrbanVillage");
    XLSX.writeFile(workbook, "UrbanVillage.xlsx");
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Pie Chart */}
      <UrbanVillageChart />

      {/* Table + Filter */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Kelurahan Tangguh</h2>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full sm:w-1/3"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex gap-2 w-full sm:w-1/3 justify-end">
            <button
              onClick={openFilter}
              className="btn btn-outline btn-info flex items-center text-sm h-10"
            >
              <FunnelIcon className="w-5 h-5 mr-1" />
              Filter
            </button>
            {role === "admin" && (
              <>
                <button
                  onClick={handleExportExcel}
                  className="btn btn-outline btn-success"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                  Excel
                </button>
                <button className="btn btn-primary flex items-center">
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
                );
              })}
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
                  className={`btn btn-sm btn-outline ${
                    page === currentPage ? "btn-active" : ""
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

export default UrbanVillage;
