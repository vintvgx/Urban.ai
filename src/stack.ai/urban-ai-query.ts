export async function urban_query(data: { "in-0": string }) {
  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac magna sit amet purus gravida cursus. Praesent sed massa vitae augue condimentum pharetra vitae id odio. Integer nec ultrices risus, id vehicula urna. Vivamus non tortor sit amet nulla facilisis tincidunt.

Duis hendrerit, elit auctor elementum lacinia, quam eros facilisis arcu, eu vehicula est nulla ut tellus. Morbi scelerisque non ante non pulvinar. Etiam viverra, sem vel elementum luctus, ante nulla cursus lacus, at vestibulum metus tellus eu nisl.

Nulla facilisi. Phasellus id enim a tellus varius fermentum. Vestibulum eget ex euismod, tristique mauris eu, congue nisl. Maecenas posuere scelerisque odio, sed laoreet metus tempus a.

Proin eu fermentum elit, eget ultrices erat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Mauris quis dolor magna. Proin tincidunt, felis id vehicula interdum, ligula felis pharetra dui, ac congue justo odio a ante.

Aliquam volutpat elit sed purus euismod, id aliquet nisl dictum. Nullam dapibus at enim vitae suscipit. Aenean lacinia, nunc id tincidunt tincidunt, libero ante mollis dui, vitae viverra magna nisi at leo.`;

  console.log(loremIpsum);

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
  return result["out-0"] || { loremIpsum }; // default message if "out-0" doesn't exist
}

urban_query({
  "in-0": `How can i make a bash script that outputs "Hello World"? And how can i run the script`,
}).then((response: any) => {
  console.log(JSON.stringify(response));
});
