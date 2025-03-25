import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllHospitals } from "../../redux/slices/hospitalSlice";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const HospitalList = () => {
  const dispatch = useDispatch();
  const { hospitals, loading, error } = useSelector((state) => state.hospitals);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllHospitals());
  }, [dispatch]);

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(search.toLowerCase()) ||
    hospital.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Browse Hospitals</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input + " mt-4 w-full"}
        />
      </div>

      {/* Hospital List */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredHospitals.length > 0 ? (
          <ul className="space-y-4">
            {filteredHospitals.map((hospital) => (
              <li key={hospital._id} className="p-4 border rounded-md shadow-md bg-white">
                <h3 className="text-xl font-bold">{hospital.name}</h3>
                <p className="text-gray-600">{hospital.location}</p>
                <Link to={`/hospital/${hospital._id}`} className="text-blue-600 hover:underline mt-2 block">
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hospitals found.</p>
        )}
      </div>
    </div>
  );
};

export default HospitalList;
