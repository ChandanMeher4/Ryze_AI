import React from "react";

export interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  onClick,
}) => {
  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400",
  };

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg font-semibold transition-all shadow-sm ${styles[variant]}`}
    >
      {label}
    </button>
  );
};
