import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      const token = res.data.data.token;

      localStorage.setItem(
        "token",
        token
      );

      navigate("/dashboard");

    }
    catch (error) {

      console.log(error);

      alert("Invalid credentials");

    }

  };



  return (

    <div className="min-h-screen flex flex-col bg-gray-50">


      {/* HEADER */}
      <div className="bg-blue-900 text-white">

        <div className="flex flex-col items-center text-center py-6 md:py-10">

          <div className="flex items-center gap-3 md:gap-5">

            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded flex items-center justify-center text-sm md:text-lg font-bold">

              LOGO

            </div>


            <div>

              <h1 className="text-lg md:text-2xl font-bold">

                Bank Transaction System

              </h1>


              <p className="text-xs md:text-sm opacity-80">

                Your trusted banking partner

              </p>


            </div>

          </div>

        </div>

      </div>



      <div className="h-1 bg-yellow-500"></div>



      {/* LOGIN CARD */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">

        <div className="bg-white shadow rounded p-6 md:p-10 w-full max-w-md">

          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">

            Sign in to your account

          </h2>



          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >


            {/* EMAIL */}
            <div>

              <label className="text-sm font-medium">

                Email

              </label>


              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 border rounded p-3 text-sm"
              />

            </div>



            {/* PASSWORD */}
            <div>

              <label className="text-sm font-medium">

                Password

              </label>


              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 border rounded p-3 text-sm"
              />

            </div>



            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded text-sm hover:bg-blue-700"
            >

              Sign in

            </button>



            <p className="text-sm text-center mt-4">

              New user?

              <Link
                to="/register"
                className="text-blue-600 ml-1 font-medium"
              >

                Create account

              </Link>

            </p>


          </form>

        </div>

      </div>



      {/* FOOTER */}
      <div className="bg-blue-900 text-white text-center p-3 text-xs">

        © 2026 Bank Transaction System

      </div>


    </div>

  );

};

export default Login;