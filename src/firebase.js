import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD68MyoSvxk7CezquvAspo2ZDk_mCqihaQ",
  authDomain: "wisdomnuggets-ed856.firebaseapp.com",
  projectId: "wisdomnuggets-ed856",
  storageBucket: "wisdomnuggets-ed856.appspot.com",
  messagingSenderId: "157562983213",
  appId: "1:157562983213:web:f0ba6433d151211f2e79a4",
  measurementId: "G-6XH693QZFY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export default db;
export { analytics };
