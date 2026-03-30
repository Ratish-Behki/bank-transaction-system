import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    name:"",
    email:"",
    password:""

  });


  const handleChange = (e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };


  const handleSubmit = async (e)=>{

    e.preventDefault();

    try{

      await API.post(

        "/auth/register",

        formData

      );

      alert("Account created successfully");

      navigate("/");

    }
    catch(error){

      alert(

        error.response?.data?.message

        || "Registration failed"

      );

    }

  };



return(

<div className="min-h-screen flex flex-col bg-gray-50">


{/* HEADER */}
<div className="bg-blue-900 text-white">

<div className="
flex flex-col items-center text-center

py-6
md:py-10">


<h1 className="
text-lg
md:text-2xl
font-bold">

Bank Transaction System

</h1>


<p className="
text-xs
md:text-sm
opacity-80">

Create your secure banking account

</p>


</div>

</div>


<div className="h-1 bg-yellow-500"></div>




{/* REGISTER CARD */}
<div className="
flex-1

flex items-center justify-center

p-4">


<div className="
bg-white

shadow
rounded

p-6
md:p-10

w-full
max-w-md">


<h2 className="
text-xl
md:text-2xl

font-semibold

mb-6

text-center">

Create Account

</h2>



<form
onSubmit={handleSubmit}

className="
space-y-4">


{/* NAME */}
<div>

<label className="
text-sm
font-medium">

Full Name

</label>


<input
name="name"
value={formData.name}
onChange={handleChange}

placeholder="Enter your name"

className="
w-full
mt-1

border
rounded

p-3

text-sm"
/>

</div>



{/* EMAIL */}
<div>

<label className="
text-sm
font-medium">

Email

</label>


<input
name="email"
value={formData.email}
onChange={handleChange}

placeholder="Enter email"

className="
w-full
mt-1

border
rounded

p-3

text-sm"
/>

</div>



{/* PASSWORD */}
<div>

<label className="
text-sm
font-medium">

Password

</label>


<input
type="password"

name="password"

value={formData.password}

onChange={handleChange}

placeholder="Create password"

className="
w-full
mt-1

border
rounded

p-3

text-sm"
/>

</div>



<button
type="submit"

className="
w-full

bg-green-600
text-white

p-3

rounded

text-sm

hover:bg-green-700">

Register

</button>



<p className="
text-sm
text-center
mt-4">

Already have account?

<Link

to="/"

className="
text-blue-600
ml-1
font-medium">

Login

</Link>

</p>



</form>


</div>

</div>




{/* FOOTER */}
<div className="
bg-blue-900
text-white

text-center

p-3

text-xs">

© 2026 Bank Transaction System

</div>


</div>

);

};

export default Register;