// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getStorage, ref, uploadString } from "firebase/storage";
import { IMessage } from "../model/types";
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
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Google Sign In Popup Provider
const _google = new GoogleAuthProvider();

// Facebook Sign In Popup Provider
const _facebook = new FacebookAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
_google.setCustomParameters({
  prompt: "select_account ",
});

export const signInWithGooglePopup = () => signInWithPopup(auth, _google);

export const signInWithFacebookPopup = () => signInWithPopup(auth, _facebook);
