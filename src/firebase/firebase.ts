// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMRydgHnrvHzBnhzQKCqZvcF3HfNCYQ7Y",
  authDomain: "urban-ai-c1cf7.firebaseapp.com",
  projectId: "urban-ai-c1cf7",
  storageBucket: "urban-ai-c1cf7.appspot.com",
  messagingSenderId: "465353696074",
  appId: "1:465353696074:web:d16426c29f7720160797b3",
  measurementId: "G-RE3Z3B0QMT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
