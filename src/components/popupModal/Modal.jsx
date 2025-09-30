import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ×
        </button>
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        <div className="overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
