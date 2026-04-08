import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAR-vhp2OmIoZH1mFtQj1PMLZ4Rg7hQGZQ',
  authDomain: 'travelbloglab4.firebaseapp.com',
  projectId: 'travelbloglab4',
  storageBucket: 'travelbloglab4.firebasestorage.app',
  messagingSenderId: '631172965947',
  appId: '1:631172965947:web:c78f9dcee3313bc9f8de1e',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
