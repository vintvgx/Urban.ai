export async function urban_query(data: { "in-0": string }) {
  try {
    const response = await fetch(
      "https://www.stack-inference.com/run_deployed_flow?flow_id=6508aaaf2096c65d46afbfc5&org=e1670d49-01c5-43d5-ae31-f6f322b3c628",
      {
        headers: {
          Authorization: "Bearer e5488071-d288-4700-8d90-0b13fdeb28be",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Server responded with ${response.status}: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
    console.log(result["out-0"]);
    return result["out-0"] || "REACHED BOT MESSAGE LIMIT.";
  } catch (error) {
    console.error("Error fetching data:", error);
    return "An error occurred while querying. Please try again.";
  }
}
