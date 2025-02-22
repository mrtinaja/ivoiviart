"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDpAuvDTy-dXzIvJIgxkvrLbjA_hId6aWk",
    authDomain: "ivoiviart.firebaseapp.com",
    projectId: "ivoiviart",
    storageBucket: "ivoiviart.firebasestorage.app",
    messagingSenderId: "580119087433",
    appId: "1:580119087433:web:670a4b1a37884d11113298",
    measurementId: "G-RXPHBPJ875",
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const analytics = (0, analytics_1.getAnalytics)(app);
