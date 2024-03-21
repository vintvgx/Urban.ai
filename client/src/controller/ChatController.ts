// ChatController.ts
import { IMessage } from "../model/types";
import { extractTimestampFromSessionID } from "../utils/functions";
import Sentry from "@sentry/react";

// const SERVER_URL = "http://localhost:4000";

const SERVER_URL = "https://urban-ai-app-4dpgega65a-ue.a.run.app";

export const generateSessionID = () => {
  return `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const fetchChatHistory = async (user: any) => {
  try {
    const response = await fetch(
      `${SERVER_URL}/fetch-messages/${user.user?.uid}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Add the createdAt property to each message
    const dataWithCreatedAt = data.map((message: IMessage) => ({
      ...message,
      createdAt: extractTimestampFromSessionID(message.sessionID),
    }));

    const sortedHistory = dataWithCreatedAt.sort(
      (a: IMessage, b: IMessage) =>
        //descending order
        b.createdAt!.getTime() - a.createdAt!.getTime()
    );

    return sortedHistory;
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return [];
  }
};

export const handleOpenAIResponse = async (
  input: string,
  user: any,
  userMessage: IMessage,
  messages: IMessage[],
  sessionID: string
) => {
  try {
    // Prepare the chat history for the API request
    const chatHistory = messages.map((msg) => {
      // Handle both string and object types for content
      const content =
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content);

      return {
        role: msg.type === "bot" ? "assistant" : "user", // Convert 'type' to the role expected by OpenAI
        content: content,
      };
    });

    console.log("chatHistory", chatHistory);

    //fetch response to the api combining the chat log array of messages and sending it as a mesage to localhost:3000 as a post
    const response = await fetch(`${SERVER_URL}/open-ai-response-server`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        chatHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Successful interaction capture
    Sentry.captureMessage("OpenAI response successful", {
      level: "info", // Optional: Adjust the level accordingly
      extra: {
        input: input,
        response: data.message,
        userEmail: user.isLoggedIn ? user.user?.email : "Guest",
        sessionID: sessionID,
      },
    });

    const botMessage: IMessage = {
      type: "bot",
      content: data.message,
      timestamp: new Date().toISOString(),
      sessionID: sessionID,
    };

    const newMessages = [...messages, userMessage, botMessage];

    // Post to MongoDB if user is signed in
    if (user.isLoggedIn) {
      try {
        // Save the messages (both user and bot)
        await fetch(`${SERVER_URL}/store-message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer`,
          },
          body: JSON.stringify({
            messages: newMessages,
            userId: user.user?.uid,
            sessionID,
          }),
        });
        console.log("----------CHATBOT SAVED-----------");
      } catch (error) {
        console.error("Failed to store messages", error);
      }
    }

    return botMessage;
  } catch (error: any) {
    console.error("Error in handleOpenAIResponse:", error);

    Sentry.captureMessage("OpenAI response error", {
      level: "error", // This is critical, hence marked as error
      extra: {
        input: input,
        error: error.message,
        userEmail: user.isLoggedIn ? user.user?.email : "Guest",
        sessionID: sessionID,
      },
    });

    const botMessage: IMessage = {
      type: "bot",
      content: "API has been overloaded. Please try again later.",
      timestamp: new Date().toISOString(),
      sessionID: sessionID,
    };
    return botMessage;
  }
};
