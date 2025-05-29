import React, { useEffect, useState } from "react";
import axios from "axios";

const AuditAdminSuper = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [table, setTable] = useState(
    "education_units",
    "health_facilities",
    "public_housings",
    "malls",
    "hotels",
    "offices",
    "apartments",
    "urban_villages",
    "educations",
    "games"
  );
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/audit/${table}`);
        setData(res.data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to fetch audit data", err);
      }
    };
    fetchData();
  }, [table]);

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

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12 relative">
      <div className="bg-base-100 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Data Tabel Audit Aktivitas</h2>

        {/* Dropdown + Search */}
        <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <select
            className="select select-bordered w-full md:w-60"
            value={table}
            onChange={(e) => setTable(e.target.value)}
          >
            <option value="education_units">Satuan Pendidikan</option>
            <option value="health_facilities">Fasilitas Kesehatan</option>
            <option value="public_housings">Rusun</option>
            <option value="malls">Mall</option>
            <option value="hotels">Hotel</option>
            <option value="offices">Perkantoran</option>
            <option value="apartments">Apartement</option>
            <option value="urban_villages">Kelurahan Tangguh</option>
            <option value="educations">Materi</option>
            <option value="games">Game</option>
            {/* Tambah tabel lain jika diperlukan */}
          </select>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full max-w-xs"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Nama Admin</th>
                <th className="text-center">Aktivitas</th>
                <th className="text-center">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              ) : (
                currentData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>
                    <td className="text-center font-bold text-orange-600">
                      {item.name}
                    </td>
                    <td className="text-center">{item.activity}</td>
                    <td className="text-center">{formatDateTime(item.time)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            ← Prev
          </button>
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

export default AuditAdminSuper;
