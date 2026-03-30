import { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {

  const [balanceData, setBalanceData] = useState({
    balance: 0,
    totalCredit: 0,
    totalDebit: 0
  });


  const getAccount = async () => {

    const res = await API.get("/accounts");

    const accountId = res.data.accounts[0]._id;

    getBalance(accountId);

  };


  const getBalance = async (id) => {

    const res = await API.get(`/accounts/balance/${id}`);

    setBalanceData(res.data.balance);

  };


  useEffect(() => {

    getAccount();

  }, []);



  return (

    <div
        className="
        pt-25 md:pt-24

        ml-0
        md:ml-56

        px-4 md:px-8

        pb-8

        flex
        flex-col
        items-center
        ">

      {/* Page Title */}
      <h1
        className="
          text-xl md:text-2xl
          font-bold
          mb-8
          text-center
        "
      >
        Dashboard
      </h1>



      {/* Cards Container */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          justify-center
          items-center

          gap-4
          w-full
          max-w-3xl
        "
      >


        {/* Total Balance */}
        <div
          className="
            bg-white
            shadow
            rounded-lg

            p-5 md:p-6

            w-full
            sm:w-60

            text-center
          "
        >

          <p className="text-sm text-gray-500">
            Total Balance
          </p>

          <h2 className="text-lg font-semibold">
            ₹ {balanceData.balance}
          </h2>

        </div>



        {/* Total Credit */}
        <div
          className="
            bg-white
            shadow
            rounded-lg

            p-5 md:p-6

            w-full
            sm:w-60

            text-center
          "
        >

          <p className="text-sm text-gray-500">
            Total Credit
          </p>

          <h2 className="text-lg font-semibold text-green-600">
            ₹ {balanceData.totalCredit}
          </h2>

        </div>



        {/* Total Debit */}
        <div
          className="
            bg-white
            shadow
            rounded-lg

            p-5 md:p-6

            w-full
            sm:w-60

            text-center
          "
        >

          <p className="text-sm text-gray-500">
            Total Debit
          </p>

          <h2 className="text-lg font-semibold text-red-600">
            ₹ {balanceData.totalDebit}
          </h2>

        </div>


      </div>


    </div>

  );

};

export default Dashboard;