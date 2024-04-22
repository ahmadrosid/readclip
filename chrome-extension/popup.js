chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    console.log(tabs)
});

document.getElementById("getContentBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(tab)
  const currentPageUrl = new URL(tab.url);

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: (pageUrl) => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = document.documentElement.outerHTML;

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
            img.setAttribute('src', `${window.origin}/${imgSrc.replace(/^\//, '')}`);
          }
        });
        return tempElement.outerHTML;
      },
      args: [currentPageUrl]
    },
    (results) => {
      console.log(results[0].result);
    }
  );
});
