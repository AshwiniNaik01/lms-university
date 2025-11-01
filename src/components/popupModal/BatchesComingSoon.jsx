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
            🎉 Coming Soon!
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto z-50 animate-fadeIn overflow-hidden"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
      >
        {/* ✨ Celebration Animations */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Floating Confetti */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* 🥳 Modal Content */}
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-3">
            🎊 Exciting News!
          </h2>
          <p className="text-gray-700 text-base mb-6 leading-relaxed">
            The batch for <strong>{course.title}</strong> is launching soon. <br />
            Stay tuned — awesome things are on the way!
          </p>

          <button
            onClick={() => setModalOpen(false)}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
          >
            Got it! 🎯
          </button>
        </div>

        {/* Custom Animation Styles */}
        <style jsx="true">{`
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

          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(-200px) rotate(360deg);
              opacity: 0;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }

          .animate-float {
            animation: float linear infinite;
          }
        `}</style>
      </Modal>
    </>
  );
};

export default BatchesComingSoon;
