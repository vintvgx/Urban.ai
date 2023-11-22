import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
import {
  signInWithFacebookPopup,
  signInWithGooglePopup,
} from "../../firebase/firebase.config";
import "./AuthView.css";
import { useTheme } from "../../theme/themeContext";
import Footer from "../../components/Footer/Footer";

const AuthView: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.user);
  const { theme } = useTheme(); // using the hook

  const location = useLocation();

  useEffect(() => {
    const isLoginState = location.state as { isLogin: boolean };
    if (isLoginState && isLoginState.isLogin !== undefined) {
      setIsLogin(isLoginState.isLogin);
    }
  }, [location.state]);

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
    dispatch(clearError());
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

  const loginFacebookUser = async () => {
    dispatch(clearError());
    try {
      const response = await signInWithFacebookPopup();

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
        dispatch(authError("Facebook Sign-In Failed"));
      }
    } catch (error) {
      dispatch(authError("Failed to login or signup with Facebook Auth."));
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <div className={`auth-view ${theme}`}>
        {isLoading && <p>Loading...</p>}
        {/* {error && <p>{error}</p>} */}
        {/* <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          Toggle to {isLogin ? "Sign Up" : "Login"}
        </button> */}
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? "Sign in to Urban.AI" : "Welcome to Urban.AI"}</h2>
          <p>{!isLogin && "Create an account to get started!"}</p>

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
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                dispatch(clearError()); // Clear error when user starts typing
              }}
            />
            {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
            <button className={theme} style={{ width: "100%" }} type="submit">
              {isLogin ? "Login" : "Sign Up"}
            </button>
            <div
              className={`toggle-text ${theme}`}
              onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? (
                <>
                  {"Don't have an account? "}
                  <span style={{ color: "blue" }}>Sign Up</span>
                </>
              ) : (
                <>
                  {"Have an account? "}
                  <span style={{ color: "blue" }}>Log in</span>
                </>
              )}
            </div>
            <p>OR</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <SocialCustomButton
                onClick={loginGoogleUser}
                imageURL="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg">
                {/* {isLogin ? "Sign in with Google" : "Sign Up with Google"} */}
                Continue with Google
              </SocialCustomButton>

              <SocialCustomButton
                onClick={loginFacebookUser}
                imageURL="https://upload.wikimedia.org/wikipedia/commons/4/4f/Facebook_circle_pictogram.svg">
                {/* {isLogin ? "Sign in with Facebook" : "Sign Up with Facebook"} */}
                Continue with Facebook
              </SocialCustomButton>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AuthView;
