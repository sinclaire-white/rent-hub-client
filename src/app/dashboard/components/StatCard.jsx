// components/StatCard.jsx

export default function StatCard({ title, value, color = "bg-blue-500" }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
      </div>
      <div className={`w-10 h-10 ${color} text-white rounded-full flex items-center justify-center font-bold`}>
        {title.charAt(0)}
      </div>
    </div>
  );
}
