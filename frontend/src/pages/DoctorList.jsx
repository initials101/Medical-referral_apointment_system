import React from "react";
import { useDispatch } from "react-redux";
import { updateDoctorStatus } from "../redux/slices/doctorSlice";

const DoctorsList = ({ doctors }) => {
  const dispatch = useDispatch();

  const handleStatusToggle = (doctorId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    dispatch(updateDoctorStatus({ doctorId, status: newStatus }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Specialization</th>
            <th className="py-2 px-4 border">Hospital</th>
            <th className="py-2 px-4 border">Experience</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id} className="text-center">
              <td className="py-2 px-4 border">{doctor.user.name}</td>
              <td className="py-2 px-4 border">{doctor.specialization}</td>
              <td className="py-2 px-4 border">{doctor.hospital.name}</td>
              <td className="py-2 px-4 border">{doctor.experience} years</td>
              <td className={`py-2 px-4 border ${doctor.status === "active" ? "text-green-600" : "text-red-600"}`}>
                {doctor.status}
              </td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleStatusToggle(doctor._id, doctor.status)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Toggle Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsList;
