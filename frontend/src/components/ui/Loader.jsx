/**
 * Spinner/loader component.
 * Props:
 *   - size: "sm" | "md" | "lg" (default: "md")
 *   - className: additional CSS classes
 */
const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-3",
};

const Loader = ({ size = "md", className = "" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
