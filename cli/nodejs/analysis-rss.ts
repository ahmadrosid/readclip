async function search(query: string) {
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.X_API_KEY);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    // example: "site:thinkmill.com.au"
    q: query,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as const,
  };

  return fetch("https://google.serper.dev/search", requestOptions).then(
    (response) => response.json()
  );
}

async function main() {
  const response = await search("site:freecodecamp.org");
  console.log(response);
}

main();
