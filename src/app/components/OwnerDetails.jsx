export default function OwnerDetails({ owner }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-2">{owner.firstName} {owner.lastName}</h1>
      <p className="text-gray-600">{owner.email}</p>
      <p className="text-gray-600">{owner.phone}</p>
      <p className="text-gray-600 capitalize">{owner.gender}</p>
    </div>
  );
}
