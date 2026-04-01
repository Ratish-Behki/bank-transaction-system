import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Sidebar = () => {

  const location = useLocation();
  const sidebarRef = useRef(null);

  const [width,setWidth] = useState(
    Number(localStorage.getItem("sidebarWidth")) || 260
  );

  const [resizing,setResizing] = useState(false);


  // smooth resize
  useEffect(()=>{

    const handleMove = (e)=>{

      if(!resizing) return;

      const newWidth =
        Math.min(Math.max(e.clientX,20),420);

      if(sidebarRef.current){

        sidebarRef.current.style.width =
        newWidth + "px";

      }

      setWidth(newWidth);

      localStorage.setItem(
        "sidebarWidth",
        newWidth
      );

    };

    const stopResize = ()=>setResizing(false);

    window.addEventListener("mousemove",handleMove);
    window.addEventListener("mouseup",stopResize);

    return ()=>{

      window.removeEventListener("mousemove",handleMove);
      window.removeEventListener("mouseup",stopResize);

    };

  },[resizing]);


  const menu = [

    { name:"Dashboard", path:"/dashboard", icon:"🏠" },

    { name:"Transactions", path:"/transactions", icon:"💳" },

    { name:"Transfer", path:"/add-transaction", icon:"🔄" },

    { name:"Request Money", path:"/request-money", icon:"💸" },

    { name:"Requests", path:"/request-list", icon:"📨" },

    { name:"Bank Transfer", path:"/system-transfer", icon:"🏦" },

    { name:"Settings", path:"/settings", icon:"⚙️" }

  ];


  return (

    <div

      ref={sidebarRef}

      style={{ width: width + "px" }}

      className="

      fixed
      top-20
      left-0
      h-[calc(100vh-5rem)]

      bg-gradient-to-b
      from-indigo-700
      via-blue-700
      to-indigo-900

      dark:from-gray-950
      dark:via-gray-900
      dark:to-gray-950

      text-white
      shadow-2xl

      flex
      flex-col

      transition-[width]
      duration-150

      z-50
      "

    >

      <div
        className="
        flex-1
        overflow-y-auto
        pt-24 md:pt-6
        px-5
        pb-6
        "
      >

        {width > 80 && (

          <div className="mb-8">

            <h1 className="text-2xl font-bold tracking-wide">

              💫 PayNova

            </h1>

            <p className="text-xs text-white/70 mt-1">
              Smart Payments
            </p>

          </div>

        )}


        <nav className="flex flex-col gap-1">

          {menu.map(item=>(

            <Link

              key={item.path}

              to={item.path}

              className={`

              flex
              items-center
              gap-3

              px-3
              py-2.5

              rounded-xl

              text-sm

              transition

              ${

                location.pathname===item.path

                ?

                "bg-white text-indigo-700 shadow-md font-medium"

                :

                "hover:bg-white/10"

              }

              `}

            >

              <span className="text-lg">

                {item.icon}

              </span>

              {width > 120 && item.name}

            </Link>

          ))}

        </nav>

      </div>


      {/* bottom */}

      <div className="px-5 pb-6">

        {width > 120 && (

          <div className="bg-white/10 rounded-xl p-3 text-xs">

            <p className="text-white/80">
              Secure Banking
            </p>

            <p className="text-white/60">
              PayNova v1.0
            </p>

          </div>

        )}

        <Link
          to="/"
          className="mt-4 block text-sm text-white/80 hover:text-white"
        >

          {width > 120 && "🚪 Logout"}

        </Link>

      </div>


      {/* resize bar */}

      <div

        onMouseDown={()=>setResizing(true)}

        className="

        absolute
        top-0
        right-0

        w-1.5
        h-full

        cursor-col-resize

        bg-white/20

        hover:bg-white

        "

      />

    </div>

  );

};

export default Sidebar;