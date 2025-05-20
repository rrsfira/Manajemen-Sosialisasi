import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BarChart = ({ data, title = "Data per Tahun" }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md w-full h-80">
      {/* ↑ p-4 untuk padding lebih nyaman, h-80 untuk tinggi lebih besar */}
      <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            label={{ value: "Tahun", position: "insideBottom", offset: 1, fontSize: 12 }}
          />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value}`, "Jumlah"]}
            labelStyle={{ color: "#374151" }}
            contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#D1D5DB" }}
          />
          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
          {/* ↑ barSize dari 30 → 40 agar batang lebih lebar */}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;