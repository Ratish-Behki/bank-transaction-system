import { useEffect, useState } from "react";
import API from "../api/axios";

import {

  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell

} from "recharts";

const Dashboard = () => {

  const [balanceData,setBalanceData] = useState({

    balance:0,
    totalCredit:0,
    totalDebit:0

  });


  const getAccount = async () => {

    try{

      const res = await API.get("/accounts");

      const accountId = res.data.accounts[0]._id;

      getBalance(accountId);

    }
    catch(error){

      console.log(error);

    }

  };


  const getBalance = async (id) => {

    try{

      const res = await API.get(`/accounts/balance/${id}`);

      setBalanceData(res.data.balance);

    }
    catch(error){

      console.log(error);

    }

  };


  useEffect(()=>{

    getAccount();

  },[]);



  const lineData = [

    {month:"Jan", amount:balanceData.balance*0.5},
    {month:"Feb", amount:balanceData.balance*0.7},
    {month:"Mar", amount:balanceData.balance*0.8},
    {month:"Apr", amount:balanceData.balance*0.9},
    {month:"May", amount:balanceData.balance}

  ];


  const pieData = [

    { name:"Credit", value:balanceData.totalCredit },
    { name:"Debit", value:balanceData.totalDebit }

  ];


  return (

    <div className="

      pt-24
      pb-12
      "
      >


      {/* header */}

      <div className="mb-8">

        <h1 className="text-2xl font-bold">

          Dashboard

        </h1>


        <p className="

        text-gray-500
        dark:text-gray-400

        text-sm

        ">

          Overview of your account activity

        </p>

      </div>



      {/* cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-10">


        <div className="p-6 rounded-xl text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg">

          <p className="text-sm opacity-80">

            Current Balance

          </p>

          <h2 className="text-2xl font-bold">

            ₹ {balanceData.balance.toLocaleString()}

          </h2>

        </div>



        <div className="p-6 rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">

          <p className="text-sm opacity-80">

            Total Credit

          </p>

          <h2 className="text-2xl font-bold">

            ₹ {balanceData.totalCredit.toLocaleString()}

          </h2>

        </div>



        <div className="p-6 rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">

          <p className="text-sm opacity-80">

            Total Debit

          </p>

          <h2 className="text-2xl font-bold">

            ₹ {balanceData.totalDebit.toLocaleString()}

          </h2>

        </div>



        <div className="p-6 rounded-xl text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">

          <p className="text-sm opacity-80">

            Total Activity

          </p>

          <h2 className="text-2xl font-bold">

            {balanceData.totalCredit + balanceData.totalDebit}

          </h2>

        </div>


      </div>



      {/* charts */}

      <div className="grid md:grid-cols-3 gap-6">


        <div className="

        bg-white
        dark:bg-gray-800

        p-6

        rounded-xl

        shadow
        dark:shadow-lg

        col-span-2

        ">

          <h2 className="font-semibold mb-4">

            Balance Trend

          </h2>


          <div className="h-64">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={lineData}>

                <XAxis dataKey="month"/>

                <Tooltip/>

                <Line type="monotone" dataKey="amount"/>

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>



        <div className="

        bg-white
        dark:bg-gray-800

        p-6

        rounded-xl

        shadow
        dark:shadow-lg

        ">

          <h2 className="font-semibold mb-4">

            Credit vs Debit

          </h2>


          <div className="h-64">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                >

                  <Cell/>

                  <Cell/>

                </Pie>

                <Tooltip/>

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>


      </div>



      {/* insight */}

      <div className="

      mt-8

      bg-white
      dark:bg-gray-800

      p-6

      rounded-xl

      shadow
      dark:shadow-lg

      ">

        <h2 className="font-semibold mb-2">

          Insight

        </h2>


        <p className="

        text-sm

        text-gray-600
        dark:text-gray-400

        ">

          Your credits are {

            balanceData.totalCredit > balanceData.totalDebit

            ? "higher"

            : "lower"

          } than debits.

        </p>

      </div>


    </div>

  );

};

export default Dashboard;