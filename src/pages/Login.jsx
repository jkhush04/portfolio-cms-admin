import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../lib/api";
import {useAuth} from "../context/AuthContext";

export default function Login(){
    const [username , setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [error , setError]=useState(null);
    const navigate=useNavigate();
    const {login}=useAuth();


    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError(null);
        try{
             const res = await api.post("/auth/login", { username, password });
                  login(res.data.token);
                  navigate("/");

                  } catch (error) {
                    setError(error.response.data.message);
                  }

    };


 return (
     <div className="min-h-screen flex items-center justify-center">
       <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80 border rounded p-6">
         <h1 className="text-xl font-bold mb-2">Admin Login</h1>
         <input
           type="text"
           placeholder="Username"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           className="border rounded p-2"
           required
         />
         <input
           type="password"
           placeholder="Password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           className="border rounded p-2"
           required
         />
         {error && <p className="text-red-500 text-sm">{error}</p>}
         <button type="submit" className="bg-black text-white rounded p-2">
           Log In
         </button>
       </form>
     </div>
   );
 }