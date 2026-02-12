import React from "react";

export interface CardProps {
  title: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="border rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
};
