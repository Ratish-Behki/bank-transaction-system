import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    name: "",
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

      await API.post(
        "/auth/register",
        formData
      );

      const loginRes = await API.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );

      // Store the token immediately so the subsequent /accounts request is authenticated
      if (loginRes.data?.data?.token) {
        localStorage.setItem("token", loginRes.data.data.token);
      }

      await API.post(
        "/accounts",
        {
          accountType: "savings",
          balance: 0
        },
        { withCredentials: true }
      );


      toast.success("Bank account created successfully 🎉");

      navigate("/");

    }
    catch (error) {

      toast.error(

        error.response?.data?.message
        || "Registration failed"

      );

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

          <div className="text-3xl mb-2">
            🏦
          </div>

          <h1 className="text-lg md:text-2xl font-bold">

            Open Your Bank Account

          </h1>


          <p className="text-xs md:text-sm opacity-80">

            Secure online account opening process

          </p>

        </div>

      </div>


      <div className="h-1 bg-yellow-500"></div>



      {/* REGISTER CARD */}

      <div className="flex-1 flex items-center justify-center p-4">

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

              Create New Account

            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">

              🔒 Your information is protected with bank-level security

            </p>

          </div>



          <form onSubmit={handleSubmit} className="space-y-4">


            {/* NAME */}

            <div>

              <label className="text-sm font-medium">

                Account Holder Name

              </label>


              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name as per ID"
                required

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



            {/* EMAIL */}

            <div>

              <label className="text-sm font-medium">

                Registered Email

              </label>


              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter active email"
                required

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

              <p className="text-xs text-gray-400 mt-1">
                Used for login and transaction alerts
              </p>

            </div>



            {/* PASSWORD */}

            <div>

              <label className="text-sm font-medium">

                Login Password

              </label>


              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create secure password"
                required
                minLength={6}

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

              <p className="text-xs text-gray-400 mt-1">
                Minimum 6 characters recommended
              </p>

            </div>



            <button
              type="submit"

              className="

              w-full

              bg-green-600

              text-white

              p-3

              rounded

              text-sm

              hover:bg-green-700

              "

            >

              Open Bank Account

            </button>



            <p className="text-sm text-center mt-4">

              Already registered?

              <Link
                to="/"

                className="

                text-blue-600

                dark:text-blue-400

                ml-1

                font-medium

                "

              >

                Secure Login

              </Link>

            </p>


            <p className="text-xs text-center text-gray-400 mt-2">

              By continuing, you agree to bank terms & privacy policy

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

        © 2026 Secure Bank System | Trusted Digital Banking

      </div>


    </div>

  );

};

export default Register;