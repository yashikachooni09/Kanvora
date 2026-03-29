import Navbar from "../Navbar/Navbar"
import Sidebar from "../sidebar/Sidebar"

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-300 text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;