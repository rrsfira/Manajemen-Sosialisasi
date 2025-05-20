import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  EyeIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Dummy data
const quantityData = [
  {
    name: "TK Mutiara",
    address: "Rungkut Asri",
    region: "Timur",
    subdistrict: "Rungkut",
    suratK: "SK-2022-08-10",
    date: "12-07-2022",
  },
  {
    name: "TK Pelita",
    address: "Nginden",
    region: "Timur",
    subdistrict: "Sukolilo",
    suratK: "",
    date: "10-08-2022",
  },
];

const Education = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate(); // hook untuk navigasi
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const filteredData = quantityData.filter((item) => {
    return Object.values(item).some((val) =>
      val.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const openFilter = () => setIsFilterVisible(true);
  const closeFilter = () => setIsFilterVisible(false);

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleViewDetails = (id) => {
    console.log("View details for ID:", id);
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Table + Filter */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Materi</h2>
        <div className="flex justify-end mb-4">
          {role === "admin" && (
            <button
              className="btn btn-primary flex items-center"
              onClick={() => navigate(`/app/Education/Create`)}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Tambah
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Nama</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  <td className="text-center">{item.name}</td>
                  <td>
                    <div className="flex justify-center">
                      <button
                        onClick={() => navigate(`/app/Education/Details`)}
                        className="btn btn-sm btn-info mr-1"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      {role === "admin" && (
                        <>
                          <button
                            className="btn btn-sm btn-warning mr-1"
                            onClick={() => navigate(`/app/Education/Edit`)}
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button className="btn btn-sm btn-error">
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
                  <td colSpan="8" className="text-center text-gray-400">
                    No data found
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
