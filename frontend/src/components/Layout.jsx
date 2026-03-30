import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {

  return (

    <div>

      {/* top bar */}
      <Navbar />



      <div className="flex">

        {/* left menu */}
        <Sidebar />



        {/* page content */}
        <div className="flex-1 p-6 bg-gray-50 min-h-screen max-w-7xl mx-auto">

          {children}

        </div>

      </div>

    </div>

  );

};

export default Layout;