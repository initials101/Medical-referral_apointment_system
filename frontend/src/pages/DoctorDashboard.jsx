import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDoctors } from "../redux/slices/doctorSlice";
import DoctorsList from "../components/Doctors/DoctorsList";

const DoctorsDashboard = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Doctors Dashboard</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : <DoctorsList doctors={doctors} />}
      </div>
    </div>
  );
};

export default DoctorsDashboard;
