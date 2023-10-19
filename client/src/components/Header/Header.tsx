import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useTheme } from "../../theme/themeContext";
import { useAppSelector } from "../../redux/store";
import { BiMenuAltLeft } from "react-icons/bi";
import { getUserInitials } from "../../utils/functions";

interface HeaderProps {
  onViewHistory?: () => void; // New prop to handle view history
  displayHistory?: boolean;
  setPadding?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onViewHistory,
  displayHistory,
  setPadding,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const user = useAppSelector((state) => state.user);

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
    <div
      className={`header-container ${setPadding ? "padding" : "no-padding"}`}>
      <div
        className={`header-content ${
          setPadding ? "pad-content" : "no-padding"
        }`}>
        {displayHistory ? (
          <div className="left-content">
            <BiMenuAltLeft size={25} onClick={onViewHistory} />
          </div>
        ) : (
          <>
            <img
              src={theme === "light" ? "./LOGOB.png" : "./LOGOW.png"}
              alt="Urban.AI Logo"
              style={{ cursor: "pointer", width: "55px" }}
              onClick={handleNavigateToRoot}
            />
            <span className="nav-item">ABOUT</span>
            <span className="nav-item">LOGIN</span>
          </>
        )}
        <div className="right-content">
          {user.isLoggedIn ? (
            <div className="user-avatar">
              <span
                className={`text-base font-extralight tracking-wide ${theme} === 'dark' ? 'text-white' : 'text-gray-800`}>
                {getUserInitials(user.user)}
              </span>
            </div>
          ) : (
            <div style={{ justifyContent: "flex-end" }}>
              <span
                className="join-btn"
                style={{ color: theme === "light" ? "black" : "white" }}
                onClick={handleNavigateToAuthView}>
                JOIN
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
