import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDoctors } from "../../redux/slices/doctorSlice";
import styles from "../../styles/styles";

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctors);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Find a Doctor</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
        <input
          type="text"
          placeholder="Search by specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredDoctors.length > 0 ? (
          <ul className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <li key={doctor._id} className="p-4 border rounded-md shadow-md bg-white">
                <p><strong>Name:</strong> {doctor.user.name}</p>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Hospital:</strong> {doctor.hospital.name}</p>
                <p><strong>Availability:</strong> {doctor.availability.join(", ")}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;
