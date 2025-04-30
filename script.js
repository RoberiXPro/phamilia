import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  push,
  update,
  remove,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Configuration Firebase (celle que tu m'as donnée)
const firebaseConfig = {
  apiKey: "AIzaSyAbzjA_ARJSOvvjX9EDG-79qTxjDgpn3wA",
  authDomain: "phamille.firebaseapp.com",
  databaseURL: "https://phamille-default-rtdb.firebaseio.com",
  projectId: "phamille",
  storageBucket: "phamille.firebasestorage.app",
  messagingSenderId: "183021771306",
  appId: "1:183021771306:web:8cf9af194dac12ad630153"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Variables globales
let username = "";
let roomName = "";

// Connexion à une salle
window.joinRoom = function () {
  username = document.getElementById("username").value;
  roomName = document.getElementById("room-name-input").value;
  const password = document.getElementById("password-input").value;

  if (!username || !roomName || !password) {
    alert("Tous les champs sont obligatoires.");
    return;
  }

  const roomRef = ref(db, "rooms/" + roomName);
  get(child(ref(db), "rooms/" + roomName)).then((snapshot) => {
    if (snapshot.exists()) {
      if (snapshot.val().password !== password) {
        alert("Mot de passe incorrect !");
        return;
      }
    } else {
      set(roomRef, {
        password: password,
        messages: {}
      });
    }

    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    document.getElementById("room-name-display").textContent = "Villa : " + roomName;

    const userRef = ref(db, "rooms/" + roomName + "/onlineUsers/" + username);
    set(userRef, {
      status: "en ligne",
      lastSeen: new Date().toISOString()
    });

    onChildAdded(ref(db, "rooms/" + roomName + "/onlineUsers"), (snap) => {
      const li = document.createElement("li");
      li.textContent = snap.key;
      document.getElementById("online-users").appendChild(li);
    });

    onChildAdded(ref(db, "rooms/" + roomName + "/messages"), (snap) => {
      const msg = snap.val();
      const div = document.createElement("div");
      div.textContent = msg.user + ": " + msg.message;
      document.getElementById("messages").appendChild(div);
    });
  });
};

// Envoi de message
window.sendMessage = function () {
  const message = document.getElementById("message-input").value;
  if (!message) return;
  const messageRef = push(ref(db, "rooms/" + roomName + "/messages"));
  set(messageRef, {
    user: username,
    message: message,
    timestamp: Date.now()
  });
  document.getElementById("message-input").value = "";
};
