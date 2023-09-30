import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import { IMessage } from "../../model/types";
import { useAppSelector } from "../../redux/store";
import {
  generateSessionID,
  fetchChatHistory,
  handleSendMessage,
} from "../../controller/ChatController";
import "./ChatView.css";
import { useTheme } from "../../theme/themeContext";

const ChatView: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [botIsThinking, setBotIsThinking] = useState(false);
  const [inputAreaBottom, setInputAreaBottom] = useState(500);
  const [messageAdded, setMessageAdded] = useState<number>(0);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<IMessage[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const user = useAppSelector((state) => state.user);
  const [sessionID, setSessionID] = useState<string>(generateSessionID());
  const { theme } = useTheme();

  useEffect(() => {
    if (!user.user) return;

    console.log("FETCH MESSAGES CALLED");
    const fetchData = async () => {
      const data = await fetchChatHistory(user);
      setChatHistory(data);
    };
    fetchData();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBotIsThinking(true);

    setTimeout(async () => {
      const newMessages = await handleSendMessage(
        input,
        user,
        messages,
        sessionID
      );
      setMessages(newMessages);
      setBotIsThinking(false);
      setMessageAdded((prev) => prev + 2); // Increment for both user and bot message
      setInput("");
    }, 2000);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, botIsThinking]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const chatContainerHeight = chatContainerRef.current.offsetHeight;
      const screenHeight = window.innerHeight;

      let newBottomValue = screenHeight - chatContainerHeight - 250;
      if (newBottomValue > 500) newBottomValue = 500;
      if (newBottomValue < screenHeight * 0.02)
        newBottomValue = screenHeight * 0.02;

      setInputAreaBottom(newBottomValue);
    }
  }, [messages, botIsThinking, messageAdded]);

  const handleSessionClick = (session: any) => {
    console.log(session);
    setMessages(session?.messages);
    setSessionID(session?.sessionID);
    setShowHistoryModal(false); // Close the history modal
  };

  const handleNewChat = () => {
    setMessages([]); // Clear the messages
    setSessionID(generateSessionID()); // Generate a new session ID
    setShowHistoryModal(false); // Close the history modal
  };

  return (
    <div style={{ height: "100vh" }}>
      <Header onViewHistory={() => setShowHistoryModal(!showHistoryModal)} />
      {showHistoryModal && (
        <div className={`history-modal ${theme}`} style={{ display: "block" }}>
          <div className="history-header">
            <h2>Chat History</h2>
            <button onClick={() => setShowHistoryModal(false)}>Close</button>
          </div>
          <div className="history-content">
            {/* New Chat option */}
            <div className="history-session new-chat" onClick={handleNewChat}>
              <h4>New Chat</h4>
            </div>
            {/* Existing sessions */}
            {chatHistory.map((session, index) => (
              <div
                key={index}
                className="history-session"
                onClick={() => handleSessionClick(session)}>
                <h4>{session.createdAt?.toLocaleString()}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="chat-wrapper">
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-wrapper ${message.type}-message-wrapper ${
                message.type === "user"
                  ? "user-message-entering"
                  : message.type === "bot"
                  ? "bot-message-entering"
                  : ""
              }`}>
              <div className={`${message.type}-message`}>
                {typeof message.content === "string"
                  ? message.content
                  : JSON.stringify(message.content)}
              </div>
            </div>
          ))}
          {botIsThinking && (
            <div className="message-wrapper bot-message-wrapper">
              <div className="bot-message">
                <div className="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className="input-area"
          style={{
            position: "absolute",
            bottom: `${inputAreaBottom}px`,
          }}>
          <textarea
            autoFocus
            rows={1}
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatView;
