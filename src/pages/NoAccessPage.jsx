import { FaLock } from "react-icons/fa";

export default function NoAccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
      <FaLock className="text-6xl text-red-500 mb-4" />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Access Denied
      </h1>

      <p className="text-gray-600 max-w-md mb-6">
        You do not have the required permissions to access this page.
        Please contact your administrator if you believe this is a mistake.
      </p>

      {/* <Link
        to="/dashboard"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md 
        hover:bg-indigo-700 transition-all"
      >
        Go to Dashboard
      </Link> */}
    </div>
  );
}
