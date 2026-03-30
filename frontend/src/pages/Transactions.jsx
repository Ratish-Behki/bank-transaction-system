import { useEffect, useState } from "react";
import API from "../api/axios";

const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);


  const getTransactions = async () => {

    try {

      const res = await API.get("/transaction");

      setTransactions(res.data);

    }
    catch (error) {

      console.log(error);

    }
    finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    getTransactions();

  }, []);



  return (

    <div className="pt-24 ml-0 md:ml-56 px-4 md:px-8 flex justify-center">

      <div className="w-full max-w-2xl">


        {/* TITLE */}
        <h1 className="text-xl md:text-2xl font-semibold mb-6 text-center">

          Transaction History

        </h1>



        {/* LOADING */}
        {
          loading && (

            <p className="text-sm text-gray-500 text-center">

              Loading transactions...

            </p>

          )
        }



        {/* LIST */}
        <div className="flex flex-col gap-3">


          {
            !loading && transactions.length === 0 && (

              <p className="text-sm text-gray-500 text-center">

                No transactions yet

              </p>

            )
          }



          {
            transactions.map((t) => (

              <div
                key={t._id}

                className="

                bg-white

                shadow

                rounded-lg

                p-4

                flex

                justify-between

                items-center

                text-sm

                "
              >


                {/* LEFT */}
                <div>

                  <p className="text-gray-500">

                    From

                  </p>


                  <p className="font-medium">

                    {
                      t.fromAccount?.user?.name
                      || "System"
                    }

                  </p>



                  <p className="text-gray-500 mt-2">

                    To

                  </p>


                  <p className="font-medium">

                    {
                      t.toAccount?.user?.name
                      || "Unknown"
                    }

                  </p>


                </div>



                {/* RIGHT */}
                <div
                  className="

                  font-semibold

                  text-base

                  text-blue-600

                  "
                >

                  ₹ {t.amount}

                </div>


              </div>

            ))
          }


        </div>


      </div>


    </div>

  );

};

export default Transactions;