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
}

const Header: React.FC<HeaderProps> = ({ onViewHistory, displayHistory }) => {
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
    <div className={` flex justify-between items-center p-3 header ${theme}`}>
      {displayHistory ? (
        <BiMenuAltLeft size={25} onClick={onViewHistory} />
      ) : (
        <h2 style={{ cursor: "pointer" }} onClick={handleNavigateToRoot}>
          Urban.AI
        </h2>
      )}
      <div>
        {user.isLoggedIn ? (
          <div
            className="flex items-center justify-center rounded-full w-12 h-12 shadow-lg"
            style={{
              boxShadow:
                theme === "light"
                  ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  : "0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)",
            }}>
            <span
              className={`text-base font-extralight tracking-wide ${theme} === 'dark' ? 'text-white' : 'text-gray-800`}>
              {getUserInitials(user.user)}
            </span>
          </div>
        ) : (
          <div>
            <span
              className="mr-2 text-xl cursor-pointer hover:text-gray-600 transition duration-200"
              onClick={handleNavigateToAuthView}>
              Login
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
