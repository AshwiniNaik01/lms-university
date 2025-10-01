import { useState } from "react";
import { FaClock, FaStar } from "react-icons/fa";
import Modal from "react-modal";

const BatchesComingSoon = ({ course }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="p-[4px] rounded-xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      >
        <div className="bg-white rounded-xl h-full flex flex-col p-5">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Batch details coming soon.
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <FaClock className="w-4 h-4 text-yellow-500" />
              <span>{course.duration || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="w-4 h-4 text-yellow-500" />
              <span>{course.rating || "No rating"}</span>
            </div>
          </div>

          <div className="mt-auto pt-2 border-t border-gray-100 text-right text-yellow-700 font-medium">
            Coming Soon
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto z-50 animate-fadeIn"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
      >
        {/* ✨ Modal Content */}
        <h2 className="text-3xl font-bold text-yellow-600 mb-4">
          Hang Tight! 🚀
        </h2>
        <p className="text-gray-700 text-base mb-6 leading-relaxed">
          The batch for <strong>{course.title}</strong> is launching soon.{" "}
          <br />
          Stay tuned — we'll notify you when it’s ready!
        </p>

        <button
          onClick={() => setModalOpen(false)}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-300"
        >
          Got it!
        </button>

        {/* Animation */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>
      </Modal>
    </>
  );
};

export default BatchesComingSoon;
