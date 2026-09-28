import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

// Use provisioned config or fallback to user-provided credentials
const firebaseConfig = {
  apiKey: config.apiKey || "AIzaSyCu3EJboUt0Zvy_fxmmKF9jUN2vJ1Wpqqo",
  authDomain: config.authDomain || "opportunity-hub-f211e.firebaseapp.com",
  projectId: config.projectId || "opportunity-hub-f211e",
  storageBucket: config.storageBucket || "opportunity-hub-f211e.firebasestorage.app",
  messagingSenderId: config.messagingSenderId || "491729344453",
  appId: config.appId || "1:491729344453:web:6ede196dc8be1f0c381dac"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Connectivity validation as recommended by skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection check: client is offline or database initializing.");
    }
  }
}
testConnection();
