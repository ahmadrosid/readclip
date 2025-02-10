// DOM Elements
const authSection = document.getElementById('authSection');
const contentSection = document.getElementById('contentSection');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const getContentBtn = document.getElementById('getContentBtn');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

// Authentication state handler
window.auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        authSection.style.display = 'none';
        contentSection.style.display = 'block';
        
        // Update user profile
        userPhoto.src = user.photoURL || 'icons/icon48.png';
        userName.textContent = user.displayName;
        userEmail.textContent = user.email;
    } else {
        // User is signed out
        authSection.style.display = 'block';
        contentSection.style.display = 'none';
    }
});

// Sign in button handler
signInBtn.addEventListener('click', async () => {
    try {
        await window.auth.signInWithGoogle();
    } catch (error) {
        console.error('Sign in error:', error);
        alert('Failed to sign in. Please try again.');
    }
});

// Sign out button handler
signOutBtn.addEventListener('click', async () => {
    try {
        await window.auth.signOut();
    } catch (error) {
        console.error('Sign out error:', error);
        alert('Failed to sign out. Please try again.');
    }
});

// Content functions
function isYouTubeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname === 'youtube.com' ||
               parsedUrl.hostname === 'www.youtube.com' ||
               parsedUrl.hostname === 'youtu.be';
    } catch (error) {
        return false;
    }
}

async function getYoutubeTranscript(url) {
    const authToken = await window.auth.getAuthToken();
    const response = await fetch("https://api.ahmadrosid.com/youtube/transcript?videoUrl=" + url, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });
    return response.json();
}

async function processPageContent(html) {
    const authToken = await window.auth.getAuthToken();
    const response = await fetch("https://readclip.site/api/convert/html", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            html: html,
        }),
    });
    return response.json();
}

// Get content button handler
getContentBtn.addEventListener("click", async () => {
    try {
        // Check authentication
        const authToken = await window.auth.getAuthToken();
        if (!authToken) {
            alert('Please sign in to use this feature');
            return;
        }

        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        getContentBtn.innerText = "Processing...";
        
        if (isYouTubeUrl(tab.url)) {
            const response = await getYoutubeTranscript(tab.url);
            await navigator.clipboard.writeText(
                `# ${response.info.title}\n\n${response.content.map((item) => item.text).join("\n")}`
            );
        } else {
            const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const tempElement = document.createElement("html");
                    tempElement.innerHTML = document.documentElement.innerHTML;

                    const currentPageUrl = new URL(document.URL);
                    
                    // Clean up the HTML
                    tempElement.querySelectorAll("script").forEach(script => script.remove());
                    tempElement.querySelectorAll("[style]").forEach(element => element.removeAttribute("style"));
                    tempElement.querySelectorAll("style").forEach(style => style.remove());
                    tempElement.querySelectorAll('img[src^="data:image"]').forEach(img => img.remove());
                    tempElement.querySelectorAll('link[rel="shortcut icon"][type="image/x-icon"]').forEach(link => link.remove());
                    tempElement.querySelectorAll("svg").forEach(svg => svg.remove());
                    
                    // Fix relative image URLs
                    tempElement.querySelectorAll("img[src]").forEach(img => {
                        const imgSrc = img.getAttribute("src");
                        if (!imgSrc.startsWith("http")) {
                            img.setAttribute('src', `${currentPageUrl.origin}/${imgSrc.replace(/^\//, '')}`);
                        }
                    });
                    
                    return tempElement.outerHTML;
                },
            });

            const response = await processPageContent(result.result);
            await navigator.clipboard.writeText(response.content);
        }

        getContentBtn.innerText = "Copied to clipboard!";
        setTimeout(() => {
            getContentBtn.innerText = "Get Content";
        }, 2000);
    } catch (error) {
        console.error('Error processing content:', error);
        getContentBtn.innerText = "Error occurred";
        setTimeout(() => {
            getContentBtn.innerText = "Get Content";
        }, 2000);
    }
});
