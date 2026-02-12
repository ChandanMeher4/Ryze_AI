export function Modal({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p>{content}</p>
      </div>
    </div>
  );
}
