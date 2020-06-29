importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDIxclHmmpVb629IOsci0jqufEhgd0gy38',
  authDomain: 'c1d13c97.firebaseapp.com',
  databaseURL: 'https://c1d13c97.firebaseio.com',
  projectId: 'c1d13c97',
  storageBucket: 'c1d13c97.appspot.com',
  messagingSenderId: '1097463938121',
  appId: '1:1097463938121:web:669fd2befd8bcce9ccd398',
  measurementId: 'G-TF7TLVZLL2'
});

const messaging = firebase.messaging();
messaging.usePublicVapidKey('BKtncKieRyTFSHCyteFJ0UqIMMjpf-nUs7qbWAxJm5Jnzbp-J9q6ACrx2sS2ePyQOwNFEHMgwBL3_oLPMsOT8VI');
