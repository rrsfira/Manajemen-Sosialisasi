import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  DocumentArrowDownIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const DataAdminSuperAdmin = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/admin")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  // Filtering data based on the search text
  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : [];

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/admin/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
              // Refresh data
              setData((prevData) => prevData.filter((item) => item.id !== id));
            } else {
              Swal.fire("Gagal", data.message || "Terjadi kesalahan.", "error");
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error", "Gagal menghapus data.", "error");
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Table + Filter */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Admin</h2>

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
              onClick={() => navigate("/spr/SuperAdmin/AdminCreate")}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Tambah
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">No</th>
                <th className="text-center">Nama</th>
                <th className="text-center">Email</th>
                <th className="text-center">Kontak</th>
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
                      {item.email || "Tidak ada data"}
                    </td>
                    <td className="text-center">
                      {item.contact || "Tidak ada data"}
                    </td>
                    <td className="text-center flex justify-center gap-1">
                      <button
                        onClick={() =>
                          navigate(`/spr/SuperAdmin/AdminEdit/${item.id}`)
                        }
                        className="btn btn-sm btn-warning mr-1"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
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

export default DataAdminSuperAdmin;
