import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const RequestList = () => {

  const [requests,setRequests] = useState([]);
  const [filtered,setFiltered] = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");
  const [actionLoading,setActionLoading] = useState("");



  const getRequests = async()=>{

    try{

      const res = await API.get("/request/incoming");

      setRequests(res.data.requests);
      setFiltered(res.data.requests);

    }
    catch(err){

      toast.error("Failed to load requests");

    }
    finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    getRequests();

  },[]);



  useEffect(()=>{

    const result = requests.filter((r)=>{

      const name =
        r.from?.name?.toLowerCase() || "";

      const email =
        r.from?.email?.toLowerCase() || "";

      return (

        name.includes(search.toLowerCase())
        ||
        email.includes(search.toLowerCase())

      );

    });

    setFiltered(result);

  },[search,requests]);



  const acceptRequest = async(id)=>{

    try{

      setActionLoading(id);

      const res = await API.post(`/request/${id}/accept`);

      toast.success(res.data.message);

      getRequests();

    }
    catch(err){

      toast.error(
        err.response?.data?.message ||
        "Failed to accept"
      );

    }
    finally{

      setActionLoading("");

    }

  };



  const rejectRequest = async(id)=>{

    try{

      setActionLoading(id);

      const res = await API.post(`/request/${id}/reject`);

      toast.success(res.data.message);

      getRequests();

    }
    catch(err){

      toast.error(
        err.response?.data?.message ||
        "Failed to reject"
      );

    }
    finally{

      setActionLoading("");

    }

  };



  return (

    <div className="pt-24 pb-10 flex justify-center">

      <div className="w-full max-w-5xl">


        {/* header */}
        <div className="text-center mb-6">

          <div className="text-3xl mb-2">
            🏦
          </div>

          <h1 className="text-2xl font-bold">

            Payment Requests

          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review and respond to incoming payment requests
          </p>

        </div>



        {/* search */}

        <div className="mb-4 flex justify-center">

          <div className="w-full md:w-72 relative">

            <input

              placeholder="Search by name or email"

              value={search}

              onChange={(e)=>setSearch(e.target.value)}

              className="

              border

              px-4
              py-2

              rounded-lg

              text-sm

              w-full

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

        </div>



        {/* table */}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-lg p-6">

          {

            loading

            ?

            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Checking latest requests...
            </div>

            :

            filtered.length === 0

            ?

            <div className="text-center py-10 text-gray-500 dark:text-gray-400">

              <div className="text-3xl mb-2">
                📭
              </div>

              No pending payment requests

            </div>

            :

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">

              <thead>

                <tr className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">

                  <th className="text-left py-3">
                    Sender
                  </th>

                  <th className="text-left py-3">
                    Email
                  </th>

                  <th className="text-left py-3">
                    Amount
                  </th>

                  <th className="text-left py-3">
                    Requested On
                  </th>

                  <th className="text-left py-3">
                    Action
                  </th>

                </tr>

              </thead>



              <tbody>

                {

                  filtered.map((r)=>(

                    <tr

                      key={r._id}

                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"

                    >

                      <td className="py-3 font-medium">
                        {r.from?.name}
                      </td>



                      <td className="py-3 text-gray-500 dark:text-gray-400">
                        {r.from?.email}
                      </td>



                      <td className="py-3 font-semibold text-blue-600">
                        ₹ {r.amount}
                      </td>



                      <td className="py-3 text-gray-500 dark:text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>



                      <td className="py-3 flex gap-2">

                        <button

                          disabled={actionLoading===r._id}

                          onClick={()=>acceptRequest(r._id)}

                          className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"

                        >

                          {actionLoading===r._id ? "Processing..." : "Accept"}

                        </button>



                        <button

                          disabled={actionLoading===r._id}

                          onClick={()=>rejectRequest(r._id)}

                          className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"

                        >

                          Reject

                        </button>

                      </td>

                    </tr>

                  ))

                }

              </tbody>

            </table>
            </div>

          }

        </div>

      </div>

    </div>

  );

};

export default RequestList;
