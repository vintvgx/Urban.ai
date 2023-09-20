export async function urban_query(data: { "in-0": string }) {
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
  const result = await response.json();
  return result["out-0"] || "I didn't understand that."; // default message if "out-0" doesn't exist
}

urban_query({
  "in-0": `How can i make a bash script that outputs "Hello World"? And how can i run the script`,
}).then((response: any) => {
  console.log(JSON.stringify(response));
});
