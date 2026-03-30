import { useState, useEffect } from "react";
import API from "../api/axios";

const AddTransaction = () => {

  const [amount,setAmount] = useState("");

  const [fromAccount,setFromAccount] = useState("");

  const [toAccount,setToAccount] = useState("");

  const [balance,setBalance] = useState(null);

  const [loading,setLoading] = useState(true);

  const [checking,setChecking] = useState(false);



  // get logged in account
  const getAccount = async () => {

    try{

      const res = await API.get("/accounts");

      if(res.data.accounts?.length){

        setFromAccount(
          res.data.accounts[0]._id
        );

      }

    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  };


  useEffect(()=>{

    getAccount();

  },[]);



  // check balance by id
  const checkBalance = async () => {

    if(!toAccount){

      alert("Enter account id");

      return;

    }

    try{

      setChecking(true);

      const res = await API.get(

        `/accounts/balance/${toAccount}`

      );

      setBalance(
        res.data.balance.balance
      );

    }
    catch(error){

      console.log(error);

      alert("Account not found");

    }
    finally{

      setChecking(false);

    }

  };



  const handleSubmit = async(e)=>{

    e.preventDefault();


    if(!toAccount){

      alert("Enter receiver account id");

      return;

    }


    if(fromAccount === toAccount){

      alert("Cannot send to same account");

      return;

    }


    try{

      await API.post(

        "/transaction",

        {

          fromAccount,
          toAccount,

          amount:Number(amount),

          idempotencyKey:
          Date.now().toString()

        }

      );

      alert("Transaction successful");

      setAmount("");

    }
    catch(error){

      alert(

        error.response?.data?.message

        || "Transaction failed"

      );

    }

  };



  return(

    <div className="pt-24 ml-0 md:ml-56 px-4 md:px-8 flex justify-center">

      <div className="bg-white shadow rounded-lg p-6 md:p-8 w-full max-w-md">


        <h1 className="text-lg md:text-xl font-semibold mb-6 text-center">

          Transfer Money

        </h1>



        {
          loading

          ?

          <p className="text-center text-gray-500 text-sm">

            Loading...

          </p>

          :

          <form
           onSubmit={handleSubmit}
           className="flex flex-col gap-4"
          >


            {/* receiver id */}
            <div>

              <label className="text-sm">

                Receiver Account ID

              </label>


              <input
                placeholder="Enter account id"

                value={toAccount}

                onChange={(e)=>setToAccount(e.target.value)}

                className="w-full mt-1 border rounded p-3 text-sm"

                required
              />

            </div>



            {/* check balance */}
            <button
              type="button"

              onClick={checkBalance}

              className="

              bg-gray-200

              p-2

              rounded

              text-sm

              hover:bg-gray-300

              "
            >

              {checking
               ? "Checking..."
               : "Check Balance"}

            </button>



            {/* show balance */}
            {
              balance !== null && (

                <p className="text-sm text-green-600">

                  Current Balance:

                  ₹ {balance}

                </p>

              )
            }



            {/* amount */}
            <div>

              <label className="text-sm">

                Amount

              </label>


              <input
                type="number"

                placeholder="Enter amount"

                value={amount}

                onChange={(e)=>setAmount(e.target.value)}

                className="w-full mt-1 border rounded p-3 text-sm"

                required
              />

            </div>



            <button
              className="

              bg-blue-600

              text-white

              p-3

              rounded

              text-sm

              hover:bg-blue-700

              "
            >

              Send Money

            </button>


          </form>

        }


      </div>

    </div>

  );

};

export default AddTransaction;