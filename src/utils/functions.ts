export const extractTimestampFromSessionID = (sessionID: string): Date => {
  if (!sessionID || typeof sessionID !== "string") {
    console.error("Invalid sessionID provided:", sessionID);
    return new Date(0); // Default to a very early date for sorting purposes
  }

  const timestampString = sessionID.split("-")[0];
  return new Date(parseInt(timestampString, 10));
};
