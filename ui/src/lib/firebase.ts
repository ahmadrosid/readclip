import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyD2Q7PY0e_rQCzQQyu3l-ceS9wUUAORpeI",
  authDomain: "readclip-auth.firebaseapp.com",
  projectId: "readclip-auth",
  appId: "1:936969372823:web:f27bcdcb5e457f030455d2",
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export default app;
