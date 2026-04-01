import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

const Layout = ({ children }) => {

  const [sidebarWidth,setSidebarWidth] = useState(
    Number(localStorage.getItem("sidebarWidth")) || 260
  );

  const [isMobile,setIsMobile] = useState(
    window.innerWidth < 768
  );

  const [open,setOpen] = useState(false);



  // detect screen size
  useEffect(()=>{

    const handleResize = ()=>{

      setIsMobile(window.innerWidth < 768);

      // close sidebar when switching desktop
      if(window.innerWidth >= 768){

        setOpen(false);

      }

    };

    window.addEventListener("resize",handleResize);

    return ()=>window.removeEventListener(
      "resize",
      handleResize
    );

  },[]);




  // listen sidebar resize (lighter interval)
  useEffect(()=>{

    const interval = setInterval(()=>{

      const w =
      Number(localStorage.getItem("sidebarWidth")) || 260;

      setSidebarWidth(w);

    },200);

    return ()=>clearInterval(interval);

  },[]);




  return (

    <div

      className="

      bg-gray-50
      dark:bg-gray-900

      min-h-screen

      text-gray-900
      dark:text-gray-100

      "

    >

      <Navbar openSidebar={()=>setOpen(true)} />



      {/* sidebar */}

      {

        isMobile

        ?

        open && <Sidebar />

        :

        <Sidebar />

      }



      {/* mobile overlay */}

      {

        open && isMobile && (

          <div

            onClick={()=>setOpen(false)}

            className="

            fixed

            inset-0

            bg-black/40

            z-40

            "

          />

        )

      }



      {/* content */}

      <div

        style={{

          marginLeft:

          isMobile

          ? "0px"

          : sidebarWidth+"px"

        }}

        className="

        pt-24

        px-4
        sm:px-6
        lg:px-8

        transition-all

        "

      >

        {children}

      </div>



    </div>

  );

};

export default Layout;