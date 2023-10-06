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
    <div className="flex flex-col h-screen">
      <Header />
      <div className=" flex-grow flex flex-col justify-center ">
        <h2 className="mb-0">Welcome to</h2>
        <h1 className=" text-8xl mt-3 ">Urban.AI</h1>
        <p className=" text-gray-600 mt-5">
          Where we ain't politically correct
        </p>
        <button className=" mt-5 text-base " onClick={goToChatView}>
          Chat Now
        </button>
      </div>
      <Footer />
    </div>
  );
}
