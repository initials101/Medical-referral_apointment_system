import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDoctors } from "../redux/slices/doctorSlice";
import { fetchAllPatients } from "../redux/slices/patientSlice";
import { fetchAllHospitals } from "../redux/slices/hospitalSlice";
import { fetchAllReferrals } from "../redux/slices/referralSlice";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const { doctors } = useSelector((state) => state.doctors);
  const { patients } = useSelector((state) => state.patients);
  const { hospitals } = useSelector((state) => state.hospitals);
  const { referrals } = useSelector((state) => state.referrals);

  useEffect(() => {
    dispatch(fetchAllDoctors());
    dispatch(fetchAllPatients());
    dispatch(fetchAllHospitals());
    dispatch(fetchAllReferrals());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* Doctors */}
        <div className="bg-white p-6 shadow-md rounded-md text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Doctors</h3>
          <p className="text-2xl font-bold text-blue-600">{doctors.length}</p>
          <Link to="/admin/doctors" className="text-sm text-blue-500 hover:underline">Manage Doctors</Link>
        </div>

        {/* Patients */}
        <div className="bg-white p-6 shadow-md rounded-md text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Patients</h3>
          <p className="text-2xl font-bold text-green-600">{patients.length}</p>
          <Link to="/admin/patients" className="text-sm text-green-500 hover:underline">Manage Patients</Link>
        </div>

        {/* Hospitals */}
        <div className="bg-white p-6 shadow-md rounded-md text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Hospitals</h3>
          <p className="text-2xl font-bold text-purple-600">{hospitals.length}</p>
          <Link to="/admin/hospitals" className="text-sm text-purple-500 hover:underline">Manage Hospitals</Link>
        </div>

        {/* Referrals */}
        <div className="bg-white p-6 shadow-md rounded-md text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Referrals</h3>
          <p className="text-2xl font-bold text-red-600">{referrals.length}</p>
          <Link to="/admin/referrals" className="text-sm text-red-500 hover:underline">Manage Referrals</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
