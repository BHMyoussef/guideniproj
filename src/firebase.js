import { initializeApp} from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { getFirestore, connectFirestoreEmulator} from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions";
const firebaseConfig = {
    apiKey: "AIzaSyC91dVQ8rDzFUhpHq0AqzJQn_gzWCBvdPs",
    authDomain: "services-app-73974.firebaseapp.com",
    projectId: "services-app-73974",
    storageBucket: "services-app-73974.appspot.com",
    messagingSenderId: "620595202429",
    appId: "1:620595202429:web:41e596375f46223a20a414"
  };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app)
const storage = getStorage(app)
const functions = getFunctions();
// if(window.location.hostname==='localhost'){
//   connectFirestoreEmulator(firestore, 'localhost', 8081);
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectStorageEmulator(storage, "localhost", 9199);
// }


export { firestore, auth, storage, functions };
