import React from "react";

const DoctorsList = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return <p className="text-center text-gray-500">No doctors available.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Doctors List</h2>
      <ul className="divide-y divide-gray-200">
        {doctors.map((doctor) => (
          <li key={doctor._id} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{doctor.user.name}</h3>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-500">{doctor.hospital.name}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                doctor.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
            >
              {doctor.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorsList;
