export interface IMessage {
  type: "user" | "bot";
  content: string | object;
  timestamp?: string | null;
  sessionID: string;
  createdAt?: Date; // Add this line
}

export interface MessagesState {
  messages: { [timestamp: string]: IMessage[] };
}

export interface ITypeWriterEffect {
  message: string;
  setTypedMessage: React.Dispatch<React.SetStateAction<string>>;
  typingSpeed: number;
}

export interface User {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

export interface UserState {
  user: null | User;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: undefined | null | string;
}

export interface AuthPayload {
  email: string;
  password: string;
}
