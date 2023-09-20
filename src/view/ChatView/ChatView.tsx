import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import { urban_query } from "../../stack.ai/urban-ai-query";
import "./ChatView.css";

const ChatView: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ type: string; content: string | object }>
  >([]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages([...messages, { type: "user", content: input }]);

    const data = {
      "in-0": input,
    };
    const response = await urban_query(data);

    setMessages([
      ...messages,
      { type: "user", content: input },
      { type: "bot", content: JSON.stringify(response) },
    ]);
    setInput("");
  };

  useEffect(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      const cursor = document.getElementById("cursor");
      if (cursor) {
        cursor.style.left = `${rect.width + 20}px`;
      }
    }
  }, [input]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <Header />
      <div className="chat-container" ref={chatContainerRef}>
        <div id="cursor" className="cursor"></div>
        <div ref={textRef} className="hidden-text">
          {input}
        </div>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.type}-message-wrapper`}>
            <div className={`${message.type}-label label`}>
              {message.type.toUpperCase()}
            </div>
            <div className={`${message.type}-message`}>
              {typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content)}
            </div>
          </div>
        ))}
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
  );
};

export default ChatView;
