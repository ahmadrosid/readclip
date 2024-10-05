chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    console.log(tabs)
});

document.getElementById("getContentBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  document.getElementById("getContentBtn").innerText = " 🚧 Getting content...";

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
      const result = await fetch("https://readclip.site/api/convert/html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html_text: results[0].result,
        }),
      }).then(res => res.json());
      navigator.clipboard.writeText(result.data.content);
      document.getElementById("getContentBtn").innerText = "Copied to clipboard! 🎉";
      setTimeout(() => {
        document.getElementById("getContentBtn").innerText = "Get Content";
      }, 4000);
    }
  );
});
