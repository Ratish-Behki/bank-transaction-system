<div className="grid grid-cols-3 gap-6 mb-8">


  {/* Balance */}
  <div className="bg-white shadow-md p-6 rounded-xl">

    <p className="text-gray-500 text-sm">
      Total Balance
    </p>

    <h2 className="text-2xl font-bold mt-2">
      ₹ {balanceData.balance}
    </h2>

  </div>



  {/* Credit */}
  <div className="bg-white shadow-md p-6 rounded-xl">

    <p className="text-gray-500 text-sm">
      Total Credit
    </p>

    <h2 className="text-2xl font-bold mt-2 text-green-600">
      ₹ {balanceData.totalCredit}
    </h2>

  </div>



  {/* Debit */}
  <div className="bg-white shadow-md p-6 rounded-xl">

    <p className="text-gray-500 text-sm">
      Total Debit
    </p>

    <h2 className="text-2xl font-bold mt-2 text-red-600">
      ₹ {balanceData.totalDebit}
    </h2>

  </div>


</div>