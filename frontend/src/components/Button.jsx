const Button = ({

 text,
 onClick,
 type="button",
 variant="primary",
 fullWidth=false,
 disabled=false

}) => {


 const baseStyle =
 "px-4 py-2 rounded-lg transition font-medium";


 const variants = {

  primary:
  "bg-blue-600 text-white hover:bg-blue-700",

  success:
  "bg-green-600 text-white hover:bg-green-700",

  danger:
  "bg-red-600 text-white hover:bg-red-700",

  outline:
  "border border-gray-300 hover:bg-gray-100"

 };


 return (

  <button

   type={type}

   onClick={onClick}

   disabled={disabled}

   className={`

    ${baseStyle}

    ${variants[variant]}

    ${fullWidth ? "w-full" : ""}

   `}

  >

   {text}

  </button>

 );

};

export default Button;