import React from "react";
const EducationFilterSidebar = ({
  filterDate,
  setFilterDate,
  filterName,
  setFilterName,
  filterAddress,
  setFilterAddress,
  filterRegion,
  setFilterRegion,
  applyFilter,
  resetFilter,
  onClose,
}) => {
  return (
    <div className="fixed top-0 right-0 w-full sm:w-96 min-h-screen sm:h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-6 text-gray-800 dark:text-gray-100 flex flex-col">

    <h3 className="text-2xl font-bold mb-6 text-center">Filter</h3>
  
    <div className="flex-grow overflow-y-auto space-y-5">
      {/* Kolom Tanggal */}
      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="tanggal">
          Tanggal
        </label>
        <input
          type="date"
          id="tanggal"
          className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm p-2 text-base"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>
  
      {/* Kolom Nama Sekolah */}
      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="namaSekolah">
          Nama Sekolah
        </label>
        <input
          type="text"
          id="namaSekolah"
          placeholder="Masukkan nama sekolah"
          className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm p-2 text-base"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </div>
  
      {/* Kolom Alamat */}
      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="alamat">
          Alamat
        </label>
        <input
          type="text"
          id="alamat"
          placeholder="Masukkan alamat"
          className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm p-2 text-base"
          value={filterAddress}
          onChange={(e) => setFilterAddress(e.target.value)}
        />
      </div>
  
      {/* Kolom Wilayah */}
      <div>
        <label htmlFor="wilayah" className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1">
          Wilayah
        </label>
        <select
          id="wilayah"
          className="block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm p-2 text-base"
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
        >
          <option value="">-- Pilih Wilayah --</option>
          <option value="utara">Utara</option>
          <option value="barat">Barat</option>
          <option value="timur">Timur</option>
          <option value="selatan">Selatan</option>
          <option value="pusat">Pusat</option>
        </select>
      </div>
    </div>
  
    {/* Tombol Aksi */}
    <div className="pt-4 flex flex-wrap justify-center gap-4">
      <button className="btn btn-md btn-primary" onClick={applyFilter}>
        Filter
      </button>
      <button className="btn btn-md btn-outline" onClick={resetFilter}>
        Reset
      </button>
      <button className="btn btn-md btn-outline" onClick={() => onClose(false)}>
        Tutup
      </button>
    </div>
  
  </div>
  

  );
};

export default EducationFilterSidebar;