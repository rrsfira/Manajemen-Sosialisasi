import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

const AuditAdminSuper = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const dummyAuditData = [
            {
                username: "admin1",
                email: "admin1@example.com",
                activity: "Tambah materi",
                time: "2025-05-12 08:30:00",
            },
            {
                username: "admin2",
                email: "admin2@example.com",
                activity: "Tambah data rusun",
                time: "2025-05-12 09:00:00",
            },
        ];

        setData(dummyAuditData);
    }, []);

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

    return (
        <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12 relative">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Data Tabel Audit Admin</h2>

                <div className="mb-4 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-full max-w-xs"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th className="text-center">No.</th>
                                <th className="text-center">User</th>
                                <th className="text-center">Aktivitas</th>
                                <th className="text-center">Waktu</th>
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
                                        <div className="font-medium text-orange-500">{item.username}</div>
                                        <div className="text-xs text-gray-500">{item.email}</div>
                                    </td>
                                    <td className="text-center">{item.activity}</td>
                                    <td className="text-center">{item.time}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-primary">
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
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
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
