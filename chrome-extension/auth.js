// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2Q7PY0e_rQCzQQyu3l-ceS9wUUAORpeI",
  authDomain: "readclip-auth.firebaseapp.com",
  projectId: "readclip-auth",
  appId: "1:936969372823:web:f27bcdcb5e457f030455d2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// Check if offscreen document exists
async function hasOffscreenDocument() {
    const matchedClients = await clients.matchAll();
    return matchedClients.some(
        (c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)
    );
}

// Create offscreen document if it doesn't exist
async function setupOffscreenDocument() {
    if (!(await hasOffscreenDocument())) {
        await chrome.offscreen.createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: ['DOM_PARSER'],
            justification: 'Firebase Authentication'
        });
    }
}

// Close offscreen document
async function closeOffscreenDocument() {
    if (await hasOffscreenDocument()) {
        await chrome.offscreen.closeDocument();
    }
}

// Get auth result from offscreen document
function getAuthResult() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            target: 'offscreen',
            initAuth: true
        }, (response) => {
            if (response?.user) {
                resolve(response);
            } else {
                reject(response);
            }
        });
    });
}

// Sign in with Google
async function signInWithGoogle() {
    try {
        await setupOffscreenDocument();
        const result = await getAuthResult();
        await closeOffscreenDocument();
        const idToken = await result.user.getIdToken();
        
        // Store the token in chrome.storage
        chrome.storage.local.set({ 
            'authToken': idToken,
            'user': {
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL
            }
        });
        
        return result.user;
    } catch (error) {
        console.error('Sign in error:', error);
        await closeOffscreenDocument();
        throw error;
    }
}

// Sign out
async function signOut() {
    try {
        await chrome.storage.local.remove(['authToken', 'user']);
        // Send sign out message to offscreen document
        await chrome.runtime.sendMessage({
            target: 'offscreen',
            signOut: true
        });
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
}

// Get current auth token
async function getAuthToken() {
    return new Promise((resolve) => {
        chrome.storage.local.get('authToken', (result) => {
            resolve(result.authToken);
        });
    });
}

// Get current user
async function getCurrentUser() {
    return new Promise((resolve) => {
        chrome.storage.local.get('user', (result) => {
            resolve(result.user);
        });
    });
}

// Export functions
window.auth = {
    signInWithGoogle,
    signOut,
    getAuthToken,
    getCurrentUser
};
