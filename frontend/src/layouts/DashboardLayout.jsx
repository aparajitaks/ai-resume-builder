import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
