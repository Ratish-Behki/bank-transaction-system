import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import ZoomControl from "./ZoomControl";

const Navbar = ({ openSidebar }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [search,setSearch] = useState("");
  const [ring,setRing] = useState(false);

  const [darkMode,setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );



  // dark mode toggle
  useEffect(()=>{

    if(darkMode){

      document.documentElement.classList.add("dark");
      localStorage.setItem("theme","dark");

    }
    else{

      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme","light");

    }

  },[darkMode]);



  // clear search when leaving pages
  useEffect(()=>{

    if(
      !location.pathname.includes("transactions")
      &&
      !location.pathname.includes("request-list")
    ){

      setSearch("");

    }

  },[location.pathname]);



  // notification ring animation
  useEffect(()=>{

    const handleNotification = ()=>{

      setRing(true);

      setTimeout(()=>{

        setRing(false);

      },1500);


      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3"
      );

      audio.play();

    };

    window.addEventListener("notify",handleNotification);

    return ()=>{

      window.removeEventListener("notify",handleNotification);

    };

  },[]);




  const handleLogout = async () => {

    try {

      await API.post("/auth/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");

    }

    catch (error) {

      console.log(error);

    }

  };



  // search works for both pages
  const handleSearch = (value) => {

    setSearch(value);

    if(location.pathname.includes("request-list")){

      navigate(`/request-list?search=${value}`);

    }
    else{

      if(location.pathname !== "/transactions"){

        navigate(`/transactions?search=${value}`);

      }
      else{

        navigate(`?search=${value}`);

      }

    }

  };



  // bell click
  const goToNotifications = ()=>{

    navigate("/request-list");

  };



  return (

    <div

      className="

      fixed
      top-0
      left-0
      w-full

      bg-gradient-to-r
      from-blue-800
      via-indigo-700
      to-blue-900

      dark:from-gray-950
      dark:via-gray-900
      dark:to-gray-950

      text-white

      flex
      items-center
      justify-between

      px-4
      md:px-6

      h-20

      shadow-xl

      z-50

      "

    >


      {/* LEFT */}

      <div className="flex items-center gap-3">

        <button

          onClick={openSidebar}

          className="md:hidden text-2xl"

        >

          ☰

        </button>


        <div className="flex items-center gap-2">

          <div className="text-xl">
            🏦
          </div>

          <h1 className="text-lg md:text-xl font-semibold tracking-wide">

            Secure Bank

          </h1>

        </div>

      </div>




      {/* SEARCH */}

      <div className="hidden md:flex items-center">

        <div

          className="

          flex
          items-center
          gap-2

          bg-white/15

          backdrop-blur-md

          px-4
          py-2

          rounded-full

          border border-white/20

          "

        >

          <span className="text-lg">🔍</span>


          <input

            type="text"

            placeholder={

              location.pathname.includes("request-list")

              ?

              "Search requests"

              :

              "Search transactions"

            }

            value={search}

            onChange={(e)=>handleSearch(e.target.value)}

            className="

            bg-transparent

            outline-none

            text-white

            placeholder-white/70

            text-sm

            w-40 md:w-56

            "

          />

        </div>

      </div>




      {/* RIGHT */}

      <div className="flex items-center gap-3 md:gap-4">

        <ZoomControl />


        {/* dark mode */}

        <button

          onClick={()=>setDarkMode(!darkMode)}

          className="text-lg hover:scale-110 transition"

        >

          {darkMode ? "☀️" : "🌙"}

        </button>



        {/* notification bell */}

        <button

          onClick={goToNotifications}

          className={`relative ${ring ? "animate-bounce" : ""}`}

        >

          🔔

        </button>



        {/* profile */}

        <div className="flex items-center gap-2">

          <img

            src="https://i.pravatar.cc/40"

            alt="profile"

            className="w-8 h-8 rounded-full border border-white shadow"

          />

          <span className="hidden sm:block text-sm font-medium">

            Customer

          </span>

        </div>



        {/* logout */}

        <button

          onClick={handleLogout}

          className="

          bg-white/90

          dark:bg-gray-700

          text-blue-700

          dark:text-white

          px-3

          py-1.5

          rounded-lg

          text-sm

          font-medium

          hover:bg-white

          transition

          "

        >

          Logout

        </button>

      </div>

    </div>

  );

};

export default Navbar;