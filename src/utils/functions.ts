import { User } from "../model/types";

export const extractTimestampFromSessionID = (sessionID: string): Date => {
  if (!sessionID || typeof sessionID !== "string") {
    console.error("Invalid sessionID provided:", sessionID);
    return new Date(0); // Default to a very early date for sorting purposes
  }

  const timestampString = sessionID.split("-")[0];
  return new Date(parseInt(timestampString, 10));
};

export const getUserInitials = (user: User | null): string => {
  if (user?.displayName) {
    const names = user.displayName.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join("");
  }
  return "U"; // default initials if user or display name is not available
};
