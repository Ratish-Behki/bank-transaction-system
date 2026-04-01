import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SystemUserLogin = () => {

 const navigate = useNavigate();

 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");


 const handleSubmit = async(e)=>{

  e.preventDefault();

  try{

   const res = await API.post(

    "/auth/login",

    { email,password },

    { withCredentials:true }

   );

   // check from database role
   if(res.data.data.user.systemUser){

    toast.success("System access granted 🏦");

    navigate("/system-transfer");

   }

   else{

    toast.error("Not a System User");

   }

  }

  catch(error){

   toast.error(

    error.response?.data?.message || "Login failed"

   );

  }

 };


 return(

  <div
   className="
   pt-24
   ml-0 md:ml-60
   flex justify-center
   px-4
   bg-gray-50 dark:bg-gray-900
   min-h-screen
   "
  >

   <form
    onSubmit={handleSubmit}
    className="
    bg-white dark:bg-gray-800
    shadow dark:shadow-lg
    p-6
    rounded
    w-full max-w-sm
    "
   >

    <h2 className="text-xl font-semibold mb-4">
     System User Login
    </h2>

    <input
     placeholder="System email"
     value={email}
     onChange={(e)=>setEmail(e.target.value)}
     className="
     border p-2 w-full mb-3 rounded
     bg-white dark:bg-gray-700
     dark:text-white
     border-gray-300 dark:border-gray-600
     "
    />

    <input
     type="password"
     placeholder="Password"
     value={password}
     onChange={(e)=>setPassword(e.target.value)}
     className="
     border p-2 w-full mb-4 rounded
     bg-white dark:bg-gray-700
     dark:text-white
     border-gray-300 dark:border-gray-600
     "
    />

    <button
     className="
     bg-indigo-600 text-white
     w-full p-2 rounded
     hover:bg-indigo-700
     transition
     "
    >
     Login as Bank
    </button>

   </form>

  </div>

 );

};

export default SystemUserLogin;