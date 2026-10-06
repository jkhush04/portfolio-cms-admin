import {useAuth} from "../context/AuthContext";

export default function DashBoard(){
    const {logout}=useAuth();
    return (
         <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button onClick={logout} className="border rounded px-3 py-1">Logout</button>
              </div>
              <p>CRUD screens for About, Skills, Projects etc. go here next.</p>
            </div>
            );

    }