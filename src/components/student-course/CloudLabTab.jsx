import { FaExternalLinkAlt, FaUser, FaLock } from "react-icons/fa";

const CloudLabTab = ({ cloudLabs }) => {
  if (!cloudLabs) return null;

  const { link, students = [] } = cloudLabs;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cloud Lab Access</h2>
          <p className="text-sm text-gray-500 mt-1">
            Use the credentials below to access your assigned cloud lab
          </p>
        </div>

        {link && (
          <button
            onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            Open Cloud Lab
            <FaExternalLinkAlt className="text-sm" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Students Credentials */}
      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border bg-white p-5 shadow-sm hover:shadow-lg transition-all"
            >
              {/* Badge */}
              <span className="absolute -top-3 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                Credentials
              </span>

              <div className="space-y-4">
                {/* Username */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FaUser />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="font-semibold text-gray-800 break-all">
                      {student.username}
                    </p>
                  </div>
                </div>

                {/* Password */}
                {student.password && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <FaLock />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Password</p>
                      <p className="font-mono font-semibold text-gray-800 tracking-wide">
                        {student.password}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-gray-50 rounded-2xl border">
          <p className="text-gray-600 font-medium">
            No cloud lab credentials assigned yet.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Please check back later or contact your trainer.
          </p>
        </div>
      )}
    </div>
  );
};

export default CloudLabTab;
