import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  login,
  signup,
  authError,
  authLoading,
  clearError,
  setUser,
  setLoggedIn,
} from "../../redux/slices/authSlice";
import { AppDispatch, useAppSelector } from "../../redux/store";
import SocialCustomButton from "../../components/SocialCustomButton";
import { signInWithGooglePopup } from "../../firebase/firebase.config";
import Header from "../../components/Header/Header";
import "../AuthView/AuthView.css";

const AuthView: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(authError("Both email and password are required."));
      return;
    }

    if (!isLogin && !name) {
      dispatch(authError("Name is required for signing up."));
      return;
    }

    try {
      dispatch(clearError()); // Clear any existing errors
      dispatch(authLoading()); // Indicate loading

      const resultAction = isLogin
        ? await dispatch(login({ email, password }))
        : await dispatch(signup({ email, password }));

      unwrapResult(resultAction); // This will throw an error if the promise is rejected
      navigate("/chatview");
    } catch (err) {
      dispatch(authError("Failed to login or signup."));
    }
  };

  const loginGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();

      if (response) {
        dispatch(
          setUser({
            uid: response.user.uid,
            email: response.user.email,
            displayName: response.user.displayName,
            photoURL: response.user.photoURL,
            phoneNumber: response.user.phoneNumber,
          })
        );
        dispatch(setLoggedIn(true)); // set logged in status to true
        navigate("/chatview");
      } else {
        dispatch(authError("Google Sign-In Failed"));
      }
    } catch (error) {
      dispatch(authError("Failed to login or signup with Google Auth."));
    }
  };

  return (
    <div>
      <Header />

      <div className="auth-view">
        {isLoading && <p>Loading...</p>}
        {/* {error && <p>{error}</p>} */}
        {/* <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          Toggle to {isLogin ? "Sign Up" : "Login"}
        </button> */}
        <form onSubmit={handleSubmit}>
          <h1>
            {isLogin ? "Your Pal is waiting for you!" : "Welcome to Pawpal!"}
          </h1>
          <p>
            {isLogin
              ? "Sign into your account."
              : "Create an account to get started!"}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",

              justifyContent: "space-around",
              alignContent: "space-between",
            }}>
            <SocialCustomButton
              onClick={loginGoogleUser}
              imageURL="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg">
              {isLogin ? "Sign in with Google" : "Sign Up with Google"}
            </SocialCustomButton>

            <SocialCustomButton
              onClick={() => {}}
              imageURL="https://upload.wikimedia.org/wikipedia/commons/4/4f/Facebook_circle_pictogram.svg">
              {isLogin ? "Sign in with Facebook" : "Sign Up with Facebook"}
            </SocialCustomButton>
          </div>
          <div className="inputs-view">
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
            <button className="submit-btn" type="submit">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>
          <div className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "New to Pawpal? Sign Up" : "Already a user? Sign in"}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
