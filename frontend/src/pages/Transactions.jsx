import { useEffect, useState } from "react";
import API from "../api/axios";

const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,setSearch] = useState("");


  const getTransactions = async () => {

    try {

      const res = await API.get("/transaction");

      setTransactions(res.data);
      setFiltered(res.data);

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


  useEffect(()=>{

    const result = transactions.filter((t)=>{

      const from =
        t.fromAccount?.user?.name?.toLowerCase() || "";

      const to =
        t.toAccount?.user?.name?.toLowerCase() || "";

      return (
        from.includes(search.toLowerCase())
        ||
        to.includes(search.toLowerCase())
      );

    });

    setFiltered(result);

  },[search,transactions]);



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

        Transactions

      </h1>



      {/* search */}

      <div className="mb-4">

        <input

          placeholder="Search by name..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          className="

          border

          px-4
          py-2

          rounded-lg

          text-sm

          w-full
          md:w-72

          outline-none

          focus:ring-2
          focus:ring-blue-500

          bg-white
          dark:bg-gray-800

          dark:text-white

          border-gray-300
          dark:border-gray-600

          "

        />

      </div>




      {/* table */}

      <div

        className="

        bg-white
        dark:bg-gray-800

        rounded-xl

        shadow
        dark:shadow-lg

        p-6

        "

      >

        {

          loading

          ?

          <p className="text-gray-500 dark:text-gray-400">

            Loading...

          </p>

          :

          filtered.length === 0

          ?

          <p className="text-gray-500 dark:text-gray-400">

            No transactions found

          </p>

          :

          <table className="w-full text-sm">

            <thead>

              <tr

                className="

                text-gray-500
                dark:text-gray-400

                border-b
                dark:border-gray-700

                "

              >

                <th className="text-left py-3">

                  From

                </th>

                <th className="text-left py-3">

                  To

                </th>

                <th className="text-left py-3">

                  Amount

                </th>

                <th className="text-left py-3">

                  Date

                </th>

                <th className="text-left py-3">

                  Status

                </th>

              </tr>

            </thead>



            <tbody>

              {

                filtered.map((t)=>(

                  <tr

                    key={t._id}

                    className="

                    border-b
                    dark:border-gray-700

                    hover:bg-gray-50
                    dark:hover:bg-gray-700

                    transition

                    "

                  >



                    <td className="py-3">

                      {

                        t.fromAccount?.user?.name

                        || "System"

                      }

                    </td>



                    <td className="py-3">

                      {

                        t.toAccount?.user?.name

                        || "Unknown"

                      }

                    </td>



                    <td

                      className={`

                      py-3

                      font-semibold

                      ${

                        t.fromAccount

                        ? "text-red-500"

                        : "text-green-500"

                      }

                      `}

                    >

                      ₹ {t.amount}

                    </td>



                    <td className="py-3 text-gray-500 dark:text-gray-400">

                      {

                        new Date(t.createdAt)

                        .toLocaleDateString()

                      }

                    </td>



                    <td className="py-3">

                      <span

                        className="

                        px-3

                        py-1

                        rounded-full

                        text-xs

                        bg-green-100

                        text-green-600

                        dark:bg-green-900

                        dark:text-green-300

                        "

                      >

                        Success

                      </span>

                    </td>



                  </tr>

                ))

              }

            </tbody>

          </table>

        }

      </div>



    </div>

  );

};

export default Transactions;