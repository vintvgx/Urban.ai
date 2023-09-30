import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LandingScreenController from "../../controller/LandingScreenController";
import "./LandingScreen.css"; // Import the CSS file

export default function LandingScreen() {
  const navigate = useNavigate();
  const { goToChatView } = LandingScreenController({ navigate });

  return (
    <div className="container">
      <Header />
      <div className="center-screen">
        <h2>Welcome to</h2>
        <h1 className="large-title">Urban.AI</h1>
        <p className="sub-label">Where we ain't politically correct</p>
        <button className="chat-button" onClick={goToChatView}>
          Chat Now
        </button>
      </div>
      <Footer />
    </div>
  );
}
