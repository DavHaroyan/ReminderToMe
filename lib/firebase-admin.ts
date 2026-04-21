import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : null;

if (!admin.apps.length) {
  const options: admin.AppOptions = serviceAccount 
    ? { credential: admin.credential.cert(serviceAccount) }
    : { projectId: firebaseConfig.projectId };
  
  admin.initializeApp(options);
}

export const adminAuth = admin.auth();
export const adminMessaging = admin.messaging();
export const adminDb = getFirestore(firebaseConfig.firestoreDatabaseId);

export default admin;
