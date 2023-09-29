export interface IMessage {
  type: "user" | "bot";
  content: string | object;
  timestamp?: string | null;
  session_id: string;
}

export interface MessagesState {
  messages: { [timestamp: string]: IMessage[] };
}

export interface ITypeWriterEffect {
  message: string;
  setTypedMessage: React.Dispatch<React.SetStateAction<string>>;
  typingSpeed: number;
}

export interface Pal {
  imageSrc: string;
  altDescription: string;
}
