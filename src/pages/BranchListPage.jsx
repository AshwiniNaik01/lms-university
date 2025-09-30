// ========================== NOT USED TILL NOW ==============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig'; // API client ko seedha yahan istemaal kar rahe hain

const BranchListPage = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBranches = async () => {
            setLoading(true);
            try {
                // Hum seedha yahan API call kar rahe hain
                const response = await apiClient.get('/api/branches');

                // --- YAHAN HAI ASLI FIX ---
                // Pehle: setBranches(response.data || []);
                // Ab: Hum response.data ke andar se 'data' array nikal rahe hain
                setBranches(response.data.data || []);

                setError('');
            } catch (err) {
                setError('Failed to load branches. Please try again later.');
                console.error(err);
            }
            setLoading(false);
        };
        loadBranches();
    }, []);

    if (loading) return <p>Loading branches...</p>;
    if (error) return <p className="error-message">{error}</p>;

return (
<div className="relative min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-100 to-blue-200 overflow-hidden font-sans">
  {/* Fixed Header */}
 

  <div className="fixed top-17 left-0 w-full z-20 backdrop-blur-md bg-white/70 border-b border-indigo-200 shadow-sm py-3 px-4 md:px-16">
  <div className="text-center">
    <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
      🎓 Branch Management
    </h1>
    <p className="text-xs md:text-sm text-indigo-600 mt-0.5">
      Explore branches & their course offerings
    </p>
  </div>
</div>

  {/* Scrollable Content */}
  <div className="pt-[120px] px-4 md:px-20 pb-16 overflow-y-auto">
    {branches.length === 0 ? (
      <div className="text-center text-gray-700 text-lg mt-20">
        No branches available at the moment.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-fadeIn">
        {branches.map((branch) => (
          <div
            key={branch._id}
            className="bg-white/70 backdrop-blur-xl border border-indigo-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-between"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-indigo-800 mb-1 truncate">
                {branch.name}
              </h3>
              <p className="text-gray-700 text-sm line-clamp-3">
                {branch.description || "No description available."}
              </p>
            </div>

            <Link
              to={`/courses?branchId=${branch._id}`}
              className="mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-sm font-medium text-center px-4 py-2 rounded-lg transition-all duration-300"
            >
              View Courses
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );

};

export default BranchListPage;