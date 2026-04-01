import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const RequestMoney = () => {

  const [email,setEmail] = useState("");

  const [to,setTo] = useState(""); // userId stored automatically

  const [receiver,setReceiver] = useState(null);

  const [amount,setAmount] = useState("");

  const [sending,setSending] = useState(false);

  const [checking,setChecking] = useState(false);



  // find userId using email
  const findReceiver = async ()=>{

    if(!email){

      toast.error("Enter email");

      return;

    }

    try{

      setChecking(true);

      const res = await API.get(

        `/accounts/find-by-email?email=${email}`

      );

      setReceiver(res.data);

      setTo(res.data.userId);   // important

      toast.success("User found");

    }
    catch(err){

      setReceiver(null);

      setTo("");

      toast.error("User not found");

    }
    finally{

      setChecking(false);

    }

  };



  const handleSubmit = async(e)=>{

    e.preventDefault();

    if(!to){

      toast.error("Enter valid email");

      return;

    }

    if(amount <= 0){

      toast.error("Invalid amount");

      return;

    }

    try{

      setSending(true);

      const res = await API.post(

        "/request",

        {

          to,   // userId
          amount:Number(amount)

        }

      );

      toast.success(res.data.message);

      setEmail("");

      setAmount("");

      setReceiver(null);

      setTo("");

    }
    catch(err){

      toast.error(

        err.response?.data?.message
        ||

        "Request failed"

      );

    }
    finally{

      setSending(false);

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
        dark:shadow-lg

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

          Request Money

        </h1>



        <form

          onSubmit={handleSubmit}

          className="flex flex-col gap-5"

        >



          {/* email */}

          <div>

            <label className="text-sm font-medium">

              User Email

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

              ?

              "Checking..."

              :

              "Verify Email"

            }

          </button>



          {/* show user */}

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

                Request will be sent to:

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



          {/* submit */}

          <button

            disabled={sending}

            className="

            bg-gradient-to-r

            from-blue-600
            to-indigo-600

            text-white

            p-3

            rounded-lg

            text-sm

            font-medium

            disabled:opacity-50

            "

          >

            {

              sending

              ?

              "Sending..."

              :

              "Send Request"

            }

          </button>



        </form>



      </div>



    </div>

  );

};



export default RequestMoney;