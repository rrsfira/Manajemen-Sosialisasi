import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TitleCard from '../../../components/Cards/TitleCard';

const RegionTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { label: 'Satuan Pendidikan', key: 'education_units' },
    { label: 'Fasilitas Kesehatan', key: 'health_facilities' },
    { label: 'Rusun', key: 'public_housings' },
    { label: 'Mall', key: 'malls' },
    { label: 'Hotel', key: 'hotels' },
    { label: 'Apartemen', key: 'apartments' },
    { label: 'Perkantoran', key: 'offices' },
    { label: 'Kelurahan Tangguh', key: 'urban_villages' },
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/dashboard/fasilitas')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading data...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <TitleCard title={"Data Jumlah Sosialisasi Berdasarkan Wilayah"}>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="normal-case">Wilayah</th>
              {categories.map((cat) => (
                <th key={cat.key} className="normal-case">{cat.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.region}</td>
                {categories.map((cat) => (
                  <td key={cat.key} className="text-center">{item[cat.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
};

export default RegionTable;
