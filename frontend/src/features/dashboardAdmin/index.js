import React, { useEffect, useState } from "react";
import DashboardStats from "./components/DashboardStats";
import BarChart from "./components/BarChart";
import RegionTable from "./components/RegionTable";

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("health-facilities");
  const [tables] = useState([
    "health-facilities",
    "education-units",
    "apartments",
    "malls",
    "hotels",
    "offices",
    "public-housings",
    "urban-villages",
  ]);

  // Pemetaan nama tabel ke nama deskriptif
  const tableLabels = {
    "health-facilities": "Fasilitas Kesehatan",
    "education-units": "Satuan Pendidikan",
    "apartments": "Apartemen",
    "malls": "Mall",
    "hotels": "Hotel",
    "offices": "Perkantoran",
    "public-housings": "Rusun",
    "urban-villages": "Kelurahan Tangguh",
  };

  useEffect(() => {
    fetch(`http://localhost:5000/dashboard/group-by-year/${selectedTable}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const formatted = data.data.map((item) => ({
            name: item.year,
            value: item.value,
          }));
          setChartData(formatted);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [selectedTable]);

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

 

  return (
    <div className="p-4 space-y-6 min-h-screen bg-base-200">
      {/* Menambahkan teks sebelum DashboardStats */}
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
      Jumlah Kegiatan Sosialisasi yang Telah Dilakukan
    </h2>

    {/* Statistik ringkas */}
    <DashboardStats />

      {/* Container Chart + Filter */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-6xl mx-auto h-[26rem] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Statistik Berdasarkan Tahun
          </h2>
          <div className="flex items-center">
            <label htmlFor="tableSelect" className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              Pilih Tabel:
            </label>
            <select
              id="tableSelect"
              value={selectedTable}
              onChange={handleTableChange}
              className="select select-bordered select-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              {tables.map((table) => (
                <option key={table} value={table}>
                    {tableLabels[table]} {/* Menampilkan nama deskriptif */}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1">
          <BarChart
            data={chartData}
             title={`Jumlah Sosialisasi ${tableLabels[selectedTable]} per Tahun`} 
          />
        </div>
      </div>
     <RegionTable/>
    </div>
  );
};

export default Dashboard;