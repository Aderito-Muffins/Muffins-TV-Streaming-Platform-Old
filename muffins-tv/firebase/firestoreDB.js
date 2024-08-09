import { doc, getDoc } from "firebase/firestore";
import {firebaseConfig} from "./login";

const app = initializeApp(firebaseConfig());
const db = getFirestore(app);
const docRef = doc(db, "users");
const docSnap = await getDoc(docRef);

const content = "";

if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    content = ("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }