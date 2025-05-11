import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


// home page toh hamesha yehi render hoga logged in or not logged in when koi protected routes mein jaayega toh vo 
// dekhega ki protected route mei hai ye toh uhdr jaayega 
function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

//protected routes 
// agr user login hoga to ye ye page dikha skte hai 
function RequireAuth() {
  const { currentUser } = useContext(AuthContext);
// agr user nhi hai aur koi protected path dala toh sidha login pr redirect ho jaayega.
  if (!currentUser) return <Navigate to="/login" />;
  else {
    return (
      <div className="layout">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  }
}

export { Layout, RequireAuth };
