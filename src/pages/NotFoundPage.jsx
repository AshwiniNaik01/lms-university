import { Link } from "react-router-dom";

/**
 * NotFoundPage Component
 * ----------------------
 * This component serves as a fallback UI for any undefined routes.
 * It provides a clear "404 - Page Not Found" message with
 * navigate to return to the homepage.
 * 
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 py-5 bg-gray-50 text-gray-800">
      
      {/* Illustration for 404 error Image */}
      <img
        src="https://static.vecteezy.com/system/resources/previews/053/162/047/non_2x/concept-of-404-error-page-not-found-security-service-warning-message-studying-question-mark-inside-text-404-with-magnifying-glass-examining-the-cause-of-web-page-crash-illustration-vector.jpg" // Make sure to add this SVG or replace with your own
        alt="Page Not Found Illustration"
        className="w-94 h-64 mb-8 rounded-xl"
        loading="lazy" // Improve performance by lazy-loading the image
      />

      {/* Main heading */}
      <h1 className="text-5xl font-extrabold mb-4">404 - Page Not Found</h1>

      {/* Supporting description */}
      <p className="mb-8 text-lg max-w-md text-center">
        Oops! The page you are looking for does not exist.
      </p>

      {/* Navigation link to home */}
      {/* <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Go to Homepage
      </Link> */}
    </div>
  );
};

export default NotFoundPage;
