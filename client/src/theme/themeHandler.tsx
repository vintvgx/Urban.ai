import { useEffect } from "react";
import { useTheme } from "./themeContext";

const ThemeHandler: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return null; // This component doesn't render anything visibly.
};

export default ThemeHandler;
