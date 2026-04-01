import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const SystemTransfer = () => {

 const [toAccount,setToAccount] = useState("");
 const [amount,setAmount] = useState("");

 const handleSubmit = async(e)=>{

  e.preventDefault();

  try{

   await API.post(

    "/transaction/system/initial-funds",

    {
     toAccount,
     amount:Number(amount),

     idempotencyKey:
     crypto.randomUUID()

    }

   );

   toast.success(
    "Initial funds sent successfully 🏦💰"
   );

   setAmount("");
   setToAccount("");

  }

  catch(error){

   toast.error(

    error.response?.data?.message
    || "Transfer failed"

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
    w-full max-w-md
    "
   >

    <h2 className="text-xl font-semibold mb-4">
     Bank Initial Fund Transfer
    </h2>


    <input
     placeholder="Receiver Account ID"
     value={toAccount}
     onChange={(e)=>setToAccount(e.target.value)}
     className="
     border p-2 w-full mb-3 rounded
     bg-white dark:bg-gray-700
     dark:text-white
     border-gray-300 dark:border-gray-600
     "
    />


    <input
     type="number"
     placeholder="Amount"
     value={amount}
     onChange={(e)=>setAmount(e.target.value)}
     className="
     border p-2 w-full mb-4 rounded
     bg-white dark:bg-gray-700
     dark:text-white
     border-gray-300 dark:border-gray-600
     "
    />


    <button
     className="
     bg-green-600 text-white
     w-full p-2 rounded
     hover:bg-green-700
     transition
     "
    >
     Send Initial Funds
    </button>

   </form>

  </div>

 );

};

export default SystemTransfer;