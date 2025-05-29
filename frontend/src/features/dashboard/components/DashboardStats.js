import React, { useEffect, useState } from "react";

const DashboardStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping key ke label nama yang lebih user-friendly
  const labelMap = {
    total_health_facilities: "Jumlah Fasilitas Kesehatan",
    total_education_units: "Jumlah Unit Pendidikan",
    total_apartments: "Jumlah Apartemen",
    total_malls: "Jumlah Mall",
    total_hotels: "Jumlah Hotel",
    total_offices: "Jumlah Perkantoran",
    total_public_housings: "Jumlah Rusun",
    total_urban_villages: "Jumlah Kelurahan Tangguh",
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:5000/dashboard/health-facilities"),
          fetch("http://localhost:5000/dashboard/education-units"),
          fetch("http://localhost:5000/dashboard/apartments"),
          fetch("http://localhost:5000/dashboard/malls"),
          fetch("http://localhost:5000/dashboard/hotels"),
          fetch("http://localhost:5000/dashboard/offices"),
          fetch("http://localhost:5000/dashboard/public-housings"),
          fetch("http://localhost:5000/dashboard/urban-villages"),
        ]);

        const data = await Promise.all(responses.map((res) => res.json()));

        const combinedStats = {
          total_health_facilities: data[0].total_health_facilities,
          total_education_units: data[1].total_education_units,
          total_apartments: data[2].total_apartments,
          total_malls: data[3].total_malls,
          total_hotels: data[4].total_hotels,
          total_offices: data[5].total_offices,
          total_public_housings: data[6].total_public_housings,
          total_urban_villages: data[7].total_urban_villages,
        };

        const formattedStats = Object.entries(combinedStats).map(
          ([key, value]) => ({
            title: labelMap[key] || key, // gunakan label map
            value,
          })
        );

        setStats(formattedStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const colors = [
    "bg-info",
    "bg-success",
    "bg-warning",
    "bg-orange-500",
    "bg-blue-500",
    "bg-teal-500",
    "bg-red-500",
    "bg-indigo-500",
  ];

  return (
    <div className="px-2 pt-1"> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`card ${colors[index % colors.length]} text-white shadow-xl`}
          >
          <div className="card-body p-4"> 
              <h2 className="text-3xl font-bold">{item.value}</h2>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;