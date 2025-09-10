
// components/ChartCard.jsx

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function ChartCard({ data, title }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="font-medium mb-3">{title}</h3>
      {data && data.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#60A5FA" name="Price" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-sm text-gray-400">No data available</div>
      )}
    </div>
  );
}