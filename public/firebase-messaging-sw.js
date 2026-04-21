importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// These values are injected from the main config
// In a real app, you'd fetch these from an environment variable or config file
const firebaseConfig = {
  apiKey: "AIzaSyDna-PGLM871YDhYcQT9Pn5OwwbDkayBlU",
  authDomain: "gen-lang-client-0434898407.firebaseapp.com",
  projectId: "gen-lang-client-0434898407",
  storageBucket: "gen-lang-client-0434898407.firebasestorage.app",
  messagingSenderId: "572564586822",
  appId: "1:572564586822:web:02ad7ec1bf9b89a99ce547"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://picsum.photos/seed/reminder/200/200' 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
