"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRelocation, setFilterRelocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const fetchDevelopers = async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name, location, open_to_relocate, years_of_experience, certifications (name, issued_by), developerlanguages (proficiency_level, programminglanguages (name))');
      if (error) console.error(error);
      else setDevelopers(data);
    };
    fetchDevelopers();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const filteredDevelopers = developers
    .filter((dev) =>
      dev.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((dev) =>
      filterRelocation === 'all' ? true : dev.open_to_relocate === (filterRelocation === 'yes')
    );

  const paginatedDevelopers = filteredDevelopers.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const totalPages = Math.ceil(filteredDevelopers.length / resultsPerPage);

  const getExperienceColor = (experience) => {
    const percentage = (experience - 1) / 9; // Normalized from 1 to 10
    const green = Math.floor(255 * percentage);
    const red = 255 - green;
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans px-4">
      <header className="sticky top-0 inset-x-0 bg-black text-white p-4 w-full flex justify-between items-center shadow-md">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </header>
      <div className="flex w-full max-w-5xl mt-8">
        {/* Left Side: Scrollable Grid */}
        <div className="w-1/2 pr-4 border-r border-gray-700 overflow-y-scroll h-[75vh]">
          <div className="sticky top-0 bg-black z-10">
            <input
              type="text"
              placeholder="Search developers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring bg-black text-white font-light"
            />
            <select
              value={filterRelocation}
              onChange={(e) => setFilterRelocation(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring bg-black text-white font-light"
            >
              <option value="all">All</option>
              <option value="yes">Open to Relocate</option>
              <option value="no">Not Open to Relocate</option>
            </select>
          </div>
          <ul className="space-y-2">
            {paginatedDevelopers.map((dev) => (
              <li
                key={dev.id}
                className={`p-4 bg-gray-800 shadow rounded-lg cursor-pointer ${selectedDeveloper?.id === dev.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedDeveloper(dev)}
              >
                <h2 className="text-lg font-extrabold">{dev.name}</h2>
                <p className="font-light">Location: {dev.location}</p>
                <p className="font-light">Years of Experience: {dev.years_of_experience}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Side: Exploded View */}
        <div className="w-1/2 pl-4">
          {selectedDeveloper ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold">{selectedDeveloper.name}</h2>
              <p className="text-lg font-light">Location: {selectedDeveloper.location}</p>
              <p
                className={`text-lg font-light ${selectedDeveloper.open_to_relocate ? 'text-green-500' : 'text-red-500'}`}
              >
                Open to Relocate: {selectedDeveloper.open_to_relocate ? 'Yes' : 'No'}
              </p>
              <p
                className="text-lg font-light"
                style={{ color: getExperienceColor(selectedDeveloper.years_of_experience) }}
              >
                Years of Experience: {selectedDeveloper.years_of_experience}
              </p>
              <h3 className="font-bold mt-4">Certifications:</h3>
              <ul className="list-disc ml-4">
                {selectedDeveloper.certifications.map((cert, index) => (
                  <li key={index}>{cert.name} (Issued by: {cert.issued_by})</li>
                ))}
              </ul>
              <h3 className="font-bold mt-4">Programming Languages:</h3>
              <ul className="list-disc ml-4">
                {selectedDeveloper.developerlanguages.map((lang, index) => (
                  <li key={index}>
                    {lang.programminglanguages.name} - {lang.proficiency_level}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-lg font-light">Select a developer to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
