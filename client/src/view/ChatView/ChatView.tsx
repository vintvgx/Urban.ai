import React, { useCallback, useEffect, useRef, useState } from "react";
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
import ChatHistoryModal from "../../components/ChatHistoryModal/ChatHistoryModal";

const ChatView: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [botIsThinking, setBotIsThinking] = useState(false);
  const [inputAreaBottom, setInputAreaBottom] = useState(500);
  const [messageAdded, setMessageAdded] = useState<number>(0);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<IMessage[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [showEnterToSubmit, setShowEnterToSubmit] = useState(false);
  const user = useAppSelector((state) => state.user);
  const [sessionID, setSessionID] = useState<string>(generateSessionID());
  const [selectedSessionID, setSelectedSessionID] = useState<string | null>(
    null
  );

  const { theme } = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
    fetchData();
  };

  const fetchData = useCallback(async () => {
    const data = await fetchChatHistory(user);
    setChatHistory(data);
  }, [user]);

  useEffect(() => {
    if (!user.user) return;
    fetchData();
  }, [fetchData, user.user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the input is empty or just whitespace
    if (!input.trim()) {
      shakeInput(); // Trigger the shake animation
      return; // Exit the function early without sending the message
    }

    if (botIsThinking) {
      shakeInput(); // Trigger the shake animation
      return; // Exit from the function early
    }

    const userMessage: IMessage = {
      type: "user",
      content: input,
      timestamp: new Date().toISOString(),
      sessionID: sessionID,
    };

    // Update immediately with user's message
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessageAdded((prev) => prev + 1); // Increment the counter for user message
    setInput("");
    setBotIsThinking(true);

    // Handle bot response
    const botMessage = await handleSendMessage(
      input,
      user,
      userMessage,
      messages,
      sessionID
    );

    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setBotIsThinking(false);
    setMessageAdded((prev) => prev + 1);
    fetchData();
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

  useEffect(() => {
    // Check if messages are 0 and the input has more than 2 characters
    if (messages.length === 0 && input.length > 2) {
      setShowEnterToSubmit(true);
    } else {
      setShowEnterToSubmit(false);
    }
  }, [input, messages]);

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
    setSelectedSessionID(null);
  };

  const shakeInput = () => {
    const inputElement = document.querySelector(".chat-input") as HTMLElement;
    if (inputElement) {
      inputElement.classList.add("shake");
      // Remove the animation class after it completes
      setTimeout(() => {
        inputElement.classList.remove("shake");
      }, 500); // match the duration of the animation
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <Header
        onViewHistory={() => setShowHistoryModal(!showHistoryModal)}
        displayHistory={true}
        setPadding={false}
      />
      {showHistoryModal ? (
        <ChatHistoryModal
          theme={theme}
          chatHistory={chatHistory}
          onSessionClick={handleSessionClick}
          onNewChat={handleNewChat}
          onClose={() => setShowHistoryModal(false)}
          selectedSessionID={selectedSessionID}
          onSelectSession={(sessionID) => setSelectedSessionID(sessionID)}
        />
      ) : null}
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
          <div className="input-container">
            <textarea
              autoFocus
              rows={1}
              value={input}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            {showEnterToSubmit && (
              <div
                className={`enter-to-submit ${
                  showEnterToSubmit ? "show" : ""
                }`}>
                Press Enter to Submit
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
