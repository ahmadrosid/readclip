chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  tabs.forEach(console.log);
});

function isYouTubeUrl(url) {
  // Create a URL object
  try {
    const parsedUrl = new URL(url);
    
    // Check if the hostname is youtube.com or www.youtube.com
    // Also check for youtu.be, which is YouTube's URL shortener
    return parsedUrl.hostname === 'youtube.com' ||
           parsedUrl.hostname === 'www.youtube.com' ||
           parsedUrl.hostname === 'youtu.be';
  } catch (error) {
    // If the URL is invalid, return false
    return false;
  }
}

async function getYoutubeTranscript(url) {
  const response = await fetch("https://api.ahmadrosid.com/youtube/transcript?videoUrl=" + url);
  return response.json();
}

document.getElementById("getContentBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (isYouTubeUrl(tab.url)) {
    document.getElementById("getContentBtn").innerText = "Getting transcript...";
    const response = await getYoutubeTranscript(tab.url);
    await navigator.clipboard
      .writeText(
        `# ${
          response.info.title
        }\n\n${response.content
          .map((item) => item.text)
          .join("\n")}` + "\n\nGive me outline of this youtube video transcript."
      );
    document.getElementById("getContentBtn").innerText = "Copied to clipboard!";
    setTimeout(() => {
      document.getElementById("getContentBtn").innerText = "Get Content";
    }, 4000);
    return;
  }

  document.getElementById("getContentBtn").innerText = "Getting content...";

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const tempElement = document.createElement("html");
        tempElement.innerHTML = document.documentElement.innerHTML;

        const currentPageUrl = new URL(document.URL);
        // Remove script tags
        tempElement
          .querySelectorAll("script")
          .forEach((script) => script.remove());

        // Remove inline styles
        tempElement
          .querySelectorAll("[style]")
          .forEach((element) => element.removeAttribute("style"));

        // Remove style tags
        tempElement
          .querySelectorAll("style")
          .forEach((style) => style.remove());

        // Remove base64 encoded images
        tempElement
          .querySelectorAll('img[src^="data:image"]')
          .forEach((img) => img.remove());

        // Remove favicon links
        tempElement
          .querySelectorAll('link[rel="shortcut icon"][type="image/x-icon"]')
          .forEach((link) => link.remove());

        // Remove SVG icons
        tempElement.querySelectorAll("svg").forEach((svg) => svg.remove());

        // Fix relative image URLs
        tempElement.querySelectorAll("img[src]").forEach((img) => {
          const imgSrc = img.getAttribute("src");
          if (!imgSrc.startsWith("http")) {
            img.setAttribute('src', `${currentPageUrl.origin}/${imgSrc.replace(/^\//, '')}`);
          }
        });
        return tempElement.outerHTML;
      },
    },
    async (results) => {
      try {
        const result = await fetch("https://readclip.site/api/convert/html", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html_text: results[0].result,
          }),
        }).then(res => res.json());
        navigator.clipboard.writeText(result.data.content + "\n\nGive me outline of this article.");
        document.getElementById("getContentBtn").innerText = "Copied to clipboard!";
        setTimeout(() => {
          document.getElementById("getContentBtn").innerText = "Get Content";
        }, 4000);
      } catch (e) {
        document.getElementById("getContentBtn").innerText = "Error!";
        setTimeout(() => {
          document.getElementById("getContentBtn").innerText = "Get Content";
        }, 4000);
      }
    }
  );
});
