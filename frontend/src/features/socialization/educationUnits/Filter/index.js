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
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">Filter</h3>

      {/* Form untuk filter */}
      <div className="space-y-5">
        {/* Kolom Tanggal */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="tanggal">
            Tanggal
          </label>
          <input
            type="date"
            id="tanggal"
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-base"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        {/* Kolom Nama Sekolah */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="namaSekolah">
            Nama Sekolah
          </label>
          <input
            type="text"
            id="namaSekolah"
            placeholder="Masukkan nama sekolah"
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-base"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>

        {/* Kolom Alamat */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="alamat">
            Alamat
          </label>
          <input
            type="text"
            id="alamat"
            placeholder="Masukkan alamat"
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-base"
            value={filterAddress}
            onChange={(e) => setFilterAddress(e.target.value)}
          />
        </div>

        {/* Kolom Wilayah (Dropdown) */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="wilayah">
            Wilayah
          </label>
          <select
            id="wilayah"
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-base"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="">-- Pilih Wilayah --</option>
            <option value="utara">Utara</option>
            <option value="barat">Barat</option>
            <option value="timur">Timur</option>
            <option value="selatan">Selatan</option>
          </select>
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
    </div>
  );
};

export default EducationFilterSidebar;