import React from "react";
import { IMessage } from "../../model/types";
import { FaTimes } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { useTheme } from "../../theme/themeContext";

import "./ChatHistoryModal.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";

interface ChatHistoryModalProps {
  theme: string;
  chatHistory: IMessage[];
  onSessionClick: (session: any) => void;
  onNewChat: () => void;
  onClose: () => void;
  selectedSessionID: string | null;
  onSelectSession: (sessionID: string | null) => void;
}

const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  theme,
  chatHistory,
  onSessionClick,
  onNewChat,
  onClose,
  selectedSessionID,
  onSelectSession,
}) => {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const user = useAppSelector((state) => state.user);

  return (
    <div className={`history-modal ${theme}`} style={{ display: "block" }}>
      <div className={`history-header ${theme}`}>
        <h2>Chat History</h2>
        <FaTimes className="close-icon" size={15} onClick={onClose} />
      </div>
      {user.isLoggedIn ? (
        <div className="history-content">
          <div
            className="history-session new-chat"
            onClick={() => {
              onNewChat();
              onSelectSession(null);
            }}>
            <h4>New Chat</h4>
          </div>
          {chatHistory.map((session, index) => (
            <div
              key={index}
              className={`history-session ${
                session.sessionID === selectedSessionID ? "active" : ""
              }`}
              onClick={() => {
                onSessionClick(session);
                onSelectSession(session.sessionID);
              }}>
              <h4>{session.createdAt?.toLocaleString()}</h4>
            </div>
          ))}
        </div>
      ) : (
        <div className="not-logged-in-content">
          <h3>Sign in to save conversations</h3>
          <button
            onClick={() => navigate("/auth")} // Assuming /auth is your AuthView route
            className="sign-in-btn">
            Login
          </button>
        </div>
      )}
      <div className="footer-container">
        <FaHome
          className={`home-icon ${theme}`}
          size={20}
          color={theme === "light" ? "#333" : "#fff"}
          onClick={() => navigate("/")} // Navigate to root route
        />
        <div className="toggle-switch" onClick={toggleTheme}>
          <div className={`slider ${theme}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryModal;
