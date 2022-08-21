import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions";


const firebaseConfig = {
  apiKey:process.env.REACT_APP_APIKEY, 
  authDomain:process.env.REACT_APP_AUTHDOMAIN, 
  projectId:process.env.REACT_APP_PROJECTID, 
  storageBucket:process.env.REACT_APP_STORAGEBUCKET, 
  messagingSenderId:process.env.REACT_APP_NESSAGINGSENDERID, 
  appId:process.env.REACT_APP_APPID, 
  measurementId:process.env.REACT_APP_MEASUREMENTID,
};


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app)
const storage = getStorage(app)
const functions = getFunctions();


export { firestore, auth, storage, functions };
