import { Link } from "react-router-dom";

const Sidebar = () => {

  return (

    <div
      className="

      fixed

      top-16 md:top-20
      left-0

      h-[calc(100vh-4rem)]
      md:h-[calc(100vh-5rem)]

      w-52 md:w-56

      bg-gray-100

      border-r

      p-4

      shadow-sm

      "
    >


      {/* Title */}
      <h2
        className="
        text-lg
        md:text-xl

        font-semibold

        mb-6
        "
      >
        Menu
      </h2>



      {/* Menu Links */}
      <nav
        className="
        flex
        flex-col

        gap-3 md:gap-4

        text-sm
        md:text-base
        "
      >


        <Link
          to="/dashboard"
          className="
          px-3 py-2

          rounded

          hover:bg-blue-50
          hover:text-blue-600

          transition
          "
        >
          Dashboard
        </Link>



        <Link
          to="/transactions"
          className="
          px-3 py-2

          rounded

          hover:bg-blue-50
          hover:text-blue-600

          transition
          "
        >
          Transactions
        </Link>



        <Link
          to="/add-transaction"
          className="
          px-3 py-2

          rounded

          hover:bg-blue-50
          hover:text-blue-600

          transition
          "
        >
          Add Transaction
        </Link>


      </nav>


    </div>

  );

};

export default Sidebar;