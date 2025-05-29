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
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
        Jumlah Kegiatan Sosialisasi yang Telah Dilakukan
      </h2>

      {/* Statistik ringkas */}
      <DashboardStats />

      {/* Container Chart + Filter */}
      <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-xl shadow-lg w-full max-w-6xl mx-auto flex flex-col h-[30rem]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
            Statistik Berdasarkan Tahun
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label htmlFor="tableSelect" className="text-sm text-gray-700 dark:text-gray-300">
              Pilih Tabel:
            </label>
            <select
              id="tableSelect"
              value={selectedTable}
              onChange={handleTableChange}
              className="select select-bordered select-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-full sm:w-auto"
            >
              {tables.map((table) => (
                <option key={table} value={table}>
                  {tableLabels[table]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 overflow-x-auto">
          <BarChart
            data={chartData}
            title={`Jumlah Sosialisasi ${tableLabels[selectedTable]} per Tahun`}
          />
        </div>
      </div>

      {/* Tabel wilayah */}
      <div className="overflow-x-auto">
        <RegionTable />
      </div>
    </div>
  );
};

export default Dashboard;