import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");// to show error in ui if register cant happen
  const [isLoading, setIsLoading] = useState(false); // button ko inactive krne ke liye user baar baar submit na kre

  // to redirect user somewhere it is hook of router dom
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();// this stops on reloading the page after clicking submit
    setError("");
    setIsLoading(true);

    // jo bhi form data hai vo is object mein aa jayega
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } 
    catch (err) 
    {
  
      setError(err.response.data.message);
    } 
    finally 
    {
      setIsLoading(false); //ye toh hamesha chalega he chalega isliye finally mein dala vo 
    }
  };


  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" minLength="3" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>} 
          {/* first checked if exists and then error is shown as in the ui as the variable */}
          <Link to="/login">Already Have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
