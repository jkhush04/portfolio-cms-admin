import {NavLink, Outlet} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const links=[
      {to:"/", label:"dashboard",end:true},
      { to: "/about", label: "About" },
      { to: "/skills", label: "Skills" },
      { to: "/projects", label: "Projects" },
      { to: "/experience", label: "Experience" },
      { to: "/testimonials", label: "Testimonials" },
      { to: "/services", label: "Services" },
      { to: "/blog", label: "Blog" },
      ]


export default function AdminLayout(){
    const {logout}=useAuth();

  return (
      <div className="min-h-screen flex">
        <aside className="w-56 border-r p-4 flex flex-col">
          <h2 className="font-bold text-lg mb-6">Admin Panel</h2>

          <nav className="flex flex-col gap-1 flex-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm ${isActive ? "bg-black text-white" : "hover:bg-gray-100"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button onClick={logout} className="border rounded p-2 text-sm">
            Logout
          </button>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    );
  }