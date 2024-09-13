import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";


const firebaseConfig = {
    apiKey: "AIzaSyBpc3rVv535LsoA23HIzY6Nw7RJ12_XfIg",
    authDomain: "muffins-tv.firebaseapp.com",
    projectId: "muffins-tv",
    storageBucket: "muffins-tv.appspot.com",
    messagingSenderId: "91564806107",
    appId: "1:91564806107:web:851c0ede7a03e420c0e1fe",
    measurementId: "G-TTN3KF61MY"
  };
const app = initializeApp(firebaseConfig);

export { app };
