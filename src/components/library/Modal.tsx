import React from "react";

export interface ModalProps {
  title: string;
  content: string;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, content, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-3 text-gray-900">{title}</h2>
        <p className="text-gray-700">{content}</p>
      </div>
    </div>
  );
};
