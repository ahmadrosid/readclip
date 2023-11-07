export async function search(query: string) {
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", "");
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
    (response) => response.text()
  );
}
