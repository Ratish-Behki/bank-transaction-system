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

      alert("Invalid credentials");

    }

  };



  return (

    <div

      className="

      min-h-screen

      flex
      flex-col

      bg-gray-50
      dark:bg-gray-900

      text-gray-900
      dark:text-gray-100

      "

    >


      {/* HEADER */}

      <div

        className="

        bg-blue-900
        dark:bg-gray-800

        text-white

        "

      >

        <div className="flex flex-col items-center text-center py-6 md:py-10">

          <div className="flex items-center gap-3 md:gap-5">

            <div

              className="

              w-12
              h-12

              md:w-16
              md:h-16

              bg-white/20

              rounded

              flex
              items-center
              justify-center

              text-sm
              md:text-lg

              font-bold

              "

            >

              🏦

            </div>


            <div>

              <h1 className="text-lg md:text-2xl font-bold">

                Secure Bank Portal

              </h1>


              <p className="text-xs md:text-sm opacity-80">

                Safe • Fast • Reliable Transactions

              </p>

            </div>

          </div>

        </div>

      </div>



      <div className="h-1 bg-yellow-500"></div>



      {/* LOGIN CARD */}

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">

        <div

          className="

          bg-white
          dark:bg-gray-800

          shadow
          dark:shadow-lg

          rounded

          p-6
          md:p-10

          w-full
          max-w-md

          "

        >

          <div className="text-center mb-6">

            <h2 className="text-xl md:text-2xl font-semibold">

              Login to Internet Banking

            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">

              🔒 Your session is encrypted and secure

            </p>

          </div>



          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >


            {/* EMAIL */}

            <div>

              <label className="text-sm font-medium">

                Customer ID / Email

              </label>


              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required

                placeholder="Enter registered email"

                className="

                w-full

                mt-1

                border

                rounded

                p-3

                text-sm

                bg-white
                dark:bg-gray-700

                dark:text-white

                border-gray-300
                dark:border-gray-600

                "

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

                placeholder="Enter password"

                className="

                w-full

                mt-1

                border

                rounded

                p-3

                text-sm

                bg-white
                dark:bg-gray-700

                dark:text-white

                border-gray-300
                dark:border-gray-600

                "

              />

            </div>



            <button
              type="submit"

              className="

              w-full

              bg-blue-600

              text-white

              p-3

              rounded

              text-sm

              hover:bg-blue-700

              "

            >

              Secure Login

            </button>



            <p className="text-sm text-center mt-4">

              New user?

              <Link
                to="/register"

                className="

                text-blue-600

                dark:text-blue-400

                ml-1

                font-medium

                "

              >

                Register for Net Banking

              </Link>

            </p>


            <p className="text-xs text-center text-gray-400 mt-3">

              Never share your password or OTP with anyone

            </p>

          </form>

        </div>

      </div>



      {/* FOOTER */}

      <div

        className="

        bg-blue-900
        dark:bg-gray-800

        text-white

        text-center

        p-3

        text-xs

        "

      >

        © 2026 Secure Bank System | RBI Guidelines Followed

      </div>


    </div>

  );

};

export default Login;