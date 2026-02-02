const Navbar = () => {
  return (
    <header className="h-16 w-full flex items-center justify-between px-6 border-b bg-white">
      <h1 className="text-xl font-bold">AI Resume Builder</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Welcome 👋</span>
        <button className="text-sm text-red-500 hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
