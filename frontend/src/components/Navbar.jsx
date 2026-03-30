import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import ZoomControl from "./ZoomControl";

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {

    try {

      await API.post("/auth/logout");

      localStorage.removeItem("token");

      navigate("/");

    }
    catch (error) {

      console.log(error);

    }

  };


  return (

    <div className="

    fixed
    top-0
    left-0

    w-full

    bg-blue-600
    text-white

    flex
    items-center
    justify-between

    px-4 md:px-8

    h-16 md:h-20

    shadow-md

    z-50">

      

      {/* TITLE */}
      <h1 className="
      text-base
      md:text-xl
      font-semibold">

        Bank Transaction System

      </h1>



      {/* RIGHT SIDE */}
      <div className="
      flex
      items-center

      gap-2 md:gap-4">


        <span className="
        hidden sm:block
        text-sm md:text-base">

          Welcome, User

        </span>



        {/* zoom buttons */}
        <ZoomControl />



        <button
          onClick={handleLogout}
          className="

          bg-white
          text-blue-600

          px-2 py-1
          md:px-3 md:py-1.5

          rounded-md

          text-xs
          md:text-sm

          font-medium

          hover:bg-gray-100">

          Logout

        </button>


      </div>


    </div>

  );

};

export default Navbar;