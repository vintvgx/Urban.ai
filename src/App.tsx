import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingScreen from "./view/LandingScreen/LandingScreen";
import ChatView from "./view/ChatView/ChatView";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/chatview" element={<ChatView />} />{" "}
          {/* Add this line */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
