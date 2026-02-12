export function Navbar({ title }: { title: string }) {
  return (
    <div className="w-full bg-gray-800 text-white px-6 py-3">
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
}
