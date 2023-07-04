// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhQxvOwkzn-4s-pDG3vayAVXfA63vitZk",
  authDomain: "jama-masjid-hisab-manager.firebaseapp.com",
  projectId: "jama-masjid-hisab-manager",
  storageBucket: "jama-masjid-hisab-manager.appspot.com",
  messagingSenderId: "1031219937434",
  appId: "1:1031219937434:web:d48950817bc00c99525f23",
  measurementId: "G-BJD56PMQCZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
