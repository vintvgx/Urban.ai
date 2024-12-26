// Footer.tsx
import React from "react";
import { useTheme } from "../../theme/themeContext";
import "./Footer.css";

const Footer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`footer ${theme}`}>
      <p>© 2024 COMMUNITE. All Rights Reserved.</p>
      <div className="toggle-switch" onClick={toggleTheme}>
        <div className={`slider ${theme}`}></div>
      </div>
    </div>
  );
};

export default Footer;
