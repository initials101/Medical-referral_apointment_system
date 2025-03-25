import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Patient = () => {
  const { patientId } = useParams();
  const { patients } = useSelector((state) => state.patients);

  const patient = patients.find((p) => p._id === patientId);

  if (!patient) {
    return <p className="text-center text-red-500 mt-10">Patient not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-extrabold text-gray-900">{patient.user.name}</h2>
        <p className="text-gray-600 mt-2"><strong>Email:</strong> {patient.user.email}</p>
        <p className="text-gray-600"><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
        <p className="text-gray-600"><strong>Gender:</strong> {patient.gender}</p>
        <p className="text-gray-600"><strong>Blood Type:</strong> {patient.bloodType}</p>
        <p className="text-gray-600"><strong>Medical History:</strong> {patient.medicalHistory.join(", ")}</p>
        <p className="text-gray-600"><strong>Assigned Doctor:</strong> {patient.assignedDoctor?.user?.name || "Not Assigned"}</p>
      </div>
    </div>
  );
};

export default Patient;
