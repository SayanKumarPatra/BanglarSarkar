import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import firebaseConfig from "../../firebase-applet-config.json";

export const isPlaceholderFirebase = !firebaseConfig || 
  !firebaseConfig.projectId || 
  firebaseConfig.projectId === "" ||
  firebaseConfig.projectId === "YOUR_PROJECT_ID" ||
  firebaseConfig.apiKey === "YOUR_API_KEY";

const app = initializeApp(firebaseConfig);
// Initialize and export the firestore database instance
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const rtdb = (firebaseConfig as any).databaseURL ? getDatabase(app) : null;

