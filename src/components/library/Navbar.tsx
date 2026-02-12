import React from "react";

export interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <div className="w-full bg-gray-900 text-white px-6 py-4 shadow-md flex items-center">
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
};
