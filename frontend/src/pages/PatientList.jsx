import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPatients } from "../redux/slices/patientSlice";
import { Link } from "react-router-dom";
import styles from "../styles/styles";

const PatientList = () => {
  const dispatch = useDispatch();
  const { patients, loading, error } = useSelector((state) => state.patients);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllPatients());
  }, [dispatch]);

  const filteredPatients = patients.filter((patient) =>
    patient.user.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Patient List</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input + " mt-4 w-full"}
        />
      </div>

      {/* Patient List */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredPatients.length > 0 ? (
          <ul className="space-y-4">
            {filteredPatients.map((patient) => (
              <li key={patient._id} className="p-4 border rounded-md shadow-md bg-white">
                <h3 className="text-xl font-bold">{patient.user.name}</h3>
                <p className="text-gray-600">{patient.user.email}</p>
                <p className="text-gray-600">Assigned Doctor: {patient.assignedDoctor?.user?.name || "Not Assigned"}</p>
                <Link to={`/patient/${patient._id}`} className="text-blue-600 hover:underline mt-2 block">
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No patients found.</p>
        )}
      </div>
    </div>
  );
};

export default PatientList;
