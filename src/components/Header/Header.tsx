import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useTheme } from "../../theme/themeContext";
import { AppDispatch, useAppSelector } from "../../redux/store";
import { BiMenuAltLeft } from "react-icons/bi";
import { useDispatch } from "react-redux";

interface HeaderProps {
  onViewHistory?: () => void; // New prop to handle view history
}

const Header: React.FC<HeaderProps> = ({ onViewHistory }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const user = useAppSelector((state) => state.user);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      console.log(`${user}`);
    } else {
      console.log("NO USER.");
    }
  }, [user]);

  const handleNavigateToAuthView = () => {
    navigate("/auth");
  };

  const handleNavigateToRoot = () => {
    navigate("/");
  };

  return (
    <div className={`header ${theme}`}>
      <BiMenuAltLeft size={25} onClick={onViewHistory} />
      <h2 style={{ cursor: "pointer" }} onClick={handleNavigateToRoot}>
        Urban.AI
      </h2>
      <div className="profile-circle">
        <div className="profile-circle">
          <h3 onClick={handleNavigateToAuthView}>
            {user.isLoggedIn
              ? `Hello ${user.user?.displayName}`
              : "Sign Up / Login"}
          </h3>
          <button onClick={toggleTheme}>
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
