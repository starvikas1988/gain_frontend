import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Style/login.css";
import Navbar from "../Core/Navbar";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  forgetPasswardChange,
  login_data,
} from "../Services/Operations/ProductAPI";
import { setLoginData, setSignupData } from "../Redux/user_information";
import { Commet } from "react-loading-indicators";

const Login = () => {
  const { loginData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loader state
  const dispatch = useDispatch();
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true); // Start loader
    try {
      const result = await login_data(data);
      console.log(result);
      if (result.success) {
        dispatch(setLoginData(result.data));
        dispatch(setSignupData(result.data));
        localStorage.setItem("user_id", result.data.user_id);
        toast.success("Login Successfully");
        navigate("/");
      } else {
        setErrorMessage("Invalid phone number or password.");
      }
    } catch (error) {
      console.error("ERROR MESSAGE for login: ", error.message);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitSuccessful) {
    reset({
      mobile: "",
      password: "",
    });
  }

  //   const handlePassward = async (item) => {
  //     try {
  //       const token = loginData.access_token;
  //       const response = await forgetPasswardChange(token);
  //       console.log("forget password  : ", response);
  //     } catch (error) {
  //       console.error("Error deleting cart item:", error);
  //     }
  //   };

  return (
    <div className="login-wrapper">
      <Navbar />
      <div className="login-container">
        {loading ? (
          <div className="loading-section">
            <Commet color="#32cd32" size="medium" text="" textColor="" />
            <p>Loading....</p>
          </div>
        ) : (
          <div className="login-form">
            <h5>Login</h5>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="login-phone">
                <label htmlFor="mobile">Enter the Phone Number</label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter The Phone Number"
                  className="login-input"
                  {...register("mobile", {
                    required: "Phone number is required",
                  })}
                />
                {errors.mobile && (
                  <p className="error-text">{errors.mobile.message}</p>
                )}
              </div>
              <div className="login-phone">
                <label htmlFor="password">Enter Your Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Your Password"
                  className="login-input"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="error-text">{errors.password.message}</p>
                )}
              </div>
              <p style={{ textAlign: "end", marginBottom: "8px" }}>
                <Link
                  to="/forgot-password"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Forgot Password
                </Link>
              </p>

              <button className="form-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
              <p className="login-text">
                Don't have an account?{" "}
                <span>
                  <Link className="login-signup" to="/signup">
                    Signup
                  </Link>
                </span>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
