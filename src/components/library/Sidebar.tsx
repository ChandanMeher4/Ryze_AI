export function Sidebar({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="w-60 bg-gray-100 p-4 h-full">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
