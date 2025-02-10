// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2Q7PY0e_rQCzQQyu3l-ceS9wUUAORpeI",
  authDomain: "readclip-auth.firebaseapp.com",
  projectId: "readclip-auth",
  appId: "1:936969372823:web:f27bcdcb5e457f030455d2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Get the parent frame origin for postMessage
const PARENT_FRAME = document.location.ancestorOrigins[0];

function sendResponse(result) {
  globalThis.parent.self.postMessage(JSON.stringify(result), PARENT_FRAME);
}

// Listen for authentication requests
globalThis.addEventListener('message', function({data}) {
  if (data.initAuth) {
    // Handle sign in with popup
    firebase.auth().signInWithPopup(provider)
      .then(sendResponse)
      .catch(sendResponse);
  }
});

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    user.getIdToken().then(token => {
      chrome.storage.local.set({
        'authToken': token,
        'user': {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      });
    });
  } else {
    // User is signed out
    chrome.storage.local.remove(['authToken', 'user']);
  }
});
