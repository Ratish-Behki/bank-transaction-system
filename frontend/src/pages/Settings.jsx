import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const Settings = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [currency,setCurrency] = useState("INR");
  const [notifications,setNotifications] = useState(true);

  const [currentPassword,setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");


  useEffect(()=>{

    const user = JSON.parse(

      localStorage.getItem("user")

    );

    if(user){

      setName(user.name);
      setEmail(user.email);

    }


    API.get("/accounts")

    .then(res=>{

      if(res.data.accounts?.length){

        setCurrency(res.data.accounts[0].currency);

      }

    })

    .catch(err=>console.log(err));


    const savedNotifications = localStorage.getItem("notifications");

    if(savedNotifications){

      setNotifications(JSON.parse(savedNotifications));

    }

  },[]);



  const saveChanges = async()=>{

    try{

      await API.post("/accounts",{ currency });

      localStorage.setItem(

        "notifications",

        JSON.stringify(notifications)

      );

      alert("Changes saved successfully");

    }

    catch(err){

      console.log(err);

      alert("Error saving changes");

    }

  };



  const changePassword = async()=>{

    try{

      await API.put(

        "/settings/password",

        {

          currentPassword,
          newPassword

        }

      );

      toast.success("Password changed successfully 🔐");

      window.dispatchEvent(new Event("notify"));

      setCurrentPassword("");
      setNewPassword("");

    }

    catch(err){

      toast.error(

        err.response?.data?.message ||

        "Error changing password"

      );

    }

  };



  return (

    <div

      className="

      pt-24

      ml-0
      md:ml-60

      px-6

      pb-10

      bg-gray-50
      dark:bg-gray-900

      min-h-screen

      "

    >

      <h1 className="text-2xl font-bold mb-6">

        Settings

      </h1>



      <div className="space-y-6 max-w-2xl">



        {/* PROFILE */}

        <div className="

        bg-white
        dark:bg-gray-800

        p-6

        rounded-xl

        shadow
        dark:shadow-lg

        ">

          <h2 className="font-semibold mb-4">

            Profile Information

          </h2>



          <label className="text-xs text-gray-400">
            Full Name (optional)
        </label>

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Name"

            className="

            border

            w-full

            p-2

            rounded

            mb-3

            bg-white
            dark:bg-gray-700

            dark:text-white

            border-gray-300
            dark:border-gray-600

            "
          />


          <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"

            className="

            border

            w-full

            p-2

            rounded

            bg-white
            dark:bg-gray-700

            dark:text-white

            border-gray-300
            dark:border-gray-600

            "
          />


          <p className="

          text-xs

          text-gray-400
          dark:text-gray-500

          mt-2

          ">

            Email change requires backend support

          </p>

        </div>




        {/* PASSWORD */}

        <div className="

        bg-white
        dark:bg-gray-800

        p-6

        rounded-xl

        shadow
        dark:shadow-lg

        ">

          <h2 className="font-semibold mb-4">

            Change Password

          </h2>



          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e)=>setCurrentPassword(e.target.value)}

            className="

            border

            w-full

            p-2

            rounded

            mb-3

            bg-white
            dark:bg-gray-700

            dark:text-white

            border-gray-300
            dark:border-gray-600

            "
          />


          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}

            className="

            border

            w-full

            p-2

            rounded

            bg-white
            dark:bg-gray-700

            dark:text-white

            border-gray-300
            dark:border-gray-600

            "
          />


          <button
            onClick={changePassword}

            className="

            bg-blue-600

            text-white

            px-4

            py-2

            mt-3

            rounded

            hover:bg-blue-700

            "

          >

            Update Password

          </button>

        </div>



        {/* CURRENCY */}

        <div className="

        bg-white
        dark:bg-gray-800

        p-6

        rounded-xl

        shadow
        dark:shadow-lg

        ">

          <h2 className="font-semibold mb-4">

            Currency

          </h2>



          <select
            value={currency}
            onChange={(e)=>setCurrency(e.target.value)}

            className="

            border

            w-full

            p-2

            rounded

            bg-white
            dark:bg-gray-700

            dark:text-white

            border-gray-300
            dark:border-gray-600

            "

          >

            <option value="INR">

              INR ₹

            </option>

            <option value="USD">

              USD $

            </option>

          </select>

        </div>




        {/* SAVE */}

        <button
          onClick={saveChanges}

          className="

          bg-blue-600

          text-white

          px-6

          py-2

          rounded-lg

          font-medium

          hover:bg-blue-700

          "

        >

          Save Changes

        </button>



      </div>

    </div>

  );

};

export default Settings;