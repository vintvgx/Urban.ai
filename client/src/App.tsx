import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingScreen from "./view/LandingScreen/LandingScreen";
import ChatView from "./view/ChatView/ChatView";
import AboutView from "./view/AboutView/AboutView";
import "./App.css";
import { ThemeProvider } from "./theme/themeContext";
import ThemeHandler from "./theme/themeHandler";
import AuthView from "./view/AuthView/AuthView";
import { Provider } from "react-redux";
import store from "./redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ThemeHandler />
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingScreen />} />
              <Route path="/auth" element={<AuthView />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/chatview" element={<ChatView />} />{" "}
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
