import { useState, useEffect } from "react";
import API from "../api/axios";

const AddTransaction = () => {

  const [amount, setAmount] = useState("");

  const [fromAccount, setFromAccount] = useState("");

  const [email, setEmail] = useState("");   // NEW

  const [toAccount, setToAccount] = useState("");  // auto filled

  const [receiver, setReceiver] = useState(null);  // show receiver info

  const [loading, setLoading] = useState(true);

  const [checking, setChecking] = useState(false);



  // get logged-in user account
  const getAccount = async () => {

    try {

      const res = await API.get("/accounts");

      if (res.data.accounts?.length) {

        setFromAccount(res.data.accounts[0]._id);

      }

    }
    catch (error) {

      console.log(error);

    }
    finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    getAccount();

  }, []);



  // find account using email
  const findReceiver = async () => {

    if (!email) {

      alert("Enter email");

      return;

    }

    try {

      setChecking(true);

      const res = await API.get(

        `/accounts/find-by-email?email=${email}`

      );

      setReceiver(res.data);

      setToAccount(res.data._id);   // auto set account id

    }
    catch (error) {

      setReceiver(null);

      setToAccount("");

      alert("User not found");

    }
    finally {

      setChecking(false);

    }

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!toAccount) {

      alert("Enter valid email");

      return;

    }

    if (fromAccount === toAccount) {

      alert("Cannot send to yourself");

      return;

    }

    try {

      await API.post(

        "/transaction",

        {

          fromAccount,

          toAccount,   // already fetched from email

          amount: Number(amount),

          idempotencyKey:
            Date.now().toString()

        }

      );

      alert("Transfer successful");

      setAmount("");

      setEmail("");

      setReceiver(null);

      setToAccount("");

    }
    catch (error) {

      alert(

        error.response?.data?.message
        || "Transfer failed"

      );

    }

  };



  return (

    <div

      className="

      pt-24
      pb-10

      bg-gray-50
      dark:bg-gray-900

      min-h-screen

      flex
      justify-center

      "

    >

      <div

        className="

        bg-white
        dark:bg-gray-800

        shadow-xl

        rounded-2xl

        p-8

        w-full
        max-w-md

        "

      >

        <h1

          className="

          text-2xl

          font-bold

          mb-6

          text-center

          "

        >

          Transfer Money

        </h1>



        {

          loading

            ?

            <p className="text-center">

              Loading...

            </p>

            :

            <form

              onSubmit={handleSubmit}

              className="flex flex-col gap-5"

            >



              {/* email */}

              <div>

                <label className="text-sm font-medium">

                  Receiver Email

                </label>



                <input

                  type="email"

                  placeholder="Enter email"

                  value={email}

                  onChange={(e)=>setEmail(e.target.value)}

                  required

                  className="

                  w-full

                  mt-1

                  border

                  rounded-lg

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



              {/* verify */}

              <button

                type="button"

                onClick={findReceiver}

                className="

                bg-gray-100
                dark:bg-gray-700

                p-2

                rounded-lg

                text-sm

                "

              >

                {

                  checking
                    ? "Checking..."
                    : "Verify Email"

                }

              </button>



              {/* receiver info */}

              {

                receiver && (

                  <div

                    className="

                    bg-green-50
                    dark:bg-green-900

                    text-green-600
                    dark:text-green-300

                    p-3

                    rounded-lg

                    text-sm

                    "

                  >

                    Receiver:

                    <strong>

                      {receiver.name}

                    </strong>

                    <br/>

                    {receiver.email}

                  </div>

                )

              }



              {/* amount */}

              <div>

                <label className="text-sm font-medium">

                  Amount

                </label>



                <input

                  type="number"

                  placeholder="Enter amount"

                  value={amount}

                  onChange={(e)=>setAmount(e.target.value)}

                  required

                  className="

                  w-full

                  mt-1

                  border

                  rounded-lg

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

                className="

                bg-gradient-to-r

                from-blue-600
                to-indigo-600

                text-white

                p-3

                rounded-lg

                text-sm

                font-medium

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