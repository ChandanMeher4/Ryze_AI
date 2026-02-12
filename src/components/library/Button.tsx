export function Button({
  label,
  variant = "primary",
}: {
  label: string;
  variant?: "primary" | "secondary";
}) {
  const styles = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-200 text-gray-800",
  };

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium ${styles[variant]}`}
    >
      {label}
    </button>
  );
}
