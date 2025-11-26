
import { useEffect } from "react";
import ReactDOM from "react-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

/**
 * Modal Component
 * ----------------
 * Clean, professional, and reusable dashboard-style modal.
 * 
 * Props:
 * - isOpen (bool): Controls visibility
 * - onClose (func): Closes modal
 * - header (string): Modal title
 * - children (ReactNode): Content
 * - footer (ReactNode): Custom footer content (optional)
 * - showCancel (bool): Whether to show default cancel button
 * - primaryAction (object): Optional primary button { label, onClick }
 */
const Modal = ({
  isOpen,
  onClose,
  header = "",
  children,
  footer = null,
  showCancel = true,
  primaryAction = null,
}) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root") || document.body;

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl shadow-xl border border-gray-200
                   w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-semibold text-blue-900">{header}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold transition"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-4 overflow-y-auto flex-grow text-gray-800 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t bg-gray-50">
          {showCancel && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              <FaTimes className="w-4 h-4 text-gray-500" />
              Cancel
            </button>
          )}

          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
            >
              <FaCheck className="w-4 h-4 text-white" />
              {primaryAction.label}
            </button>
          )}

          {footer}
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>,
    modalRoot
  );
};

export default Modal;
