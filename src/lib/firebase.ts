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

// Initialize real-time database using the provided databaseURL
export const rtdb = firebaseConfig.databaseURL ? getDatabase(app) : null;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

