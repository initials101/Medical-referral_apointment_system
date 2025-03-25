import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Hospital = () => {
  const { hospitalId } = useParams();
  const { hospitals } = useSelector((state) => state.hospitals);

  const hospital = hospitals.find((h) => h._id === hospitalId);

  if (!hospital) {
    return <p className="text-center text-red-500 mt-10">Hospital not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-extrabold text-gray-900">{hospital.name}</h2>
        <p className="text-gray-600 mt-2"><strong>Location:</strong> {hospital.location}</p>
        <p className="text-gray-600"><strong>Contact:</strong> {hospital.contact}</p>
        <p className="text-gray-600"><strong>Departments:</strong> {hospital.departments.join(", ")}</p>
      </div>
    </div>
  );
};

export default Hospital;
