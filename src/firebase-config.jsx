// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBu84JCq9W5lkYA7Amkh4WrGJ81htwBm_Q",
  authDomain: "auth-practice-c867e.firebaseapp.com",
  projectId: "auth-practice-c867e",
  storageBucket: "auth-practice-c867e.appspot.com",
  messagingSenderId: "707507269361",
  databaseURL: "https://auth-practice-c867e-default-rtdb.firebaseio.com",
  appId: "1:707507269361:web:bba8d2b875a3a339cb8350",
  measurementId: "G-12PBHT8HFD",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

/*
// Database rules 
{
  "rules": {
    "users": {
      "$userId": {
        // grants write access to the owner of this user account
        // whose uid must exactly match the key ($userId)
        ".write": "$userId === auth.uid"
      }
    }
  }
}

*/
