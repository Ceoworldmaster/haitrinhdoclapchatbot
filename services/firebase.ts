// Define Firebase global type since we're using CDN scripts
declare global {
  interface Window {
    firebase: any;
  }
}

const firebaseConfig = {
    apiKey: "AIzaSyAAxgcN2O2ZCq2XgxtYHeVcmeyQ7Cm4O6Y",
    authDomain: "haitrinhdoclap.firebaseapp.com",
    databaseURL: "https://haitrinhdoclap-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "haitrinhdoclap",
    storageBucket: "haitrinhdoclap.firebasestorage.app",
    messagingSenderId: "530540431379",
    appId: "1:530540431379:web:8178615238bd7d5bee17e6",
    measurementId: "G-SD58SCWWF1"
};

const firebase = window.firebase;

// Initialize Firebase
if (firebase && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase ? firebase.auth() : null;
export const database = firebase ? firebase.database() : null;
export const googleProvider = firebase ? new firebase.auth.GoogleAuthProvider() : null;

if (googleProvider) {
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
}
