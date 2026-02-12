import React from "react";

export interface SidebarProps {
  items: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 h-full overflow-y-auto shadow-inner">
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition-all"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
