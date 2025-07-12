// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwxyXYCMPPFTqAgPAHA1PqDD-UsgIRplU",
  authDomain: "student-teacher-appointm-61b40.firebaseapp.com",
  projectId: "student-teacher-appointm-61b40",
  storageBucket: "student-teacher-appointm-61b40.appspot.com",
  messagingSenderId: "823998219344",
  appId: "1:823998219344:web:535778a2e1c2ecd578fd55"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
