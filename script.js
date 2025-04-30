// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbzjA_ARJSOvvjX9EDG-79qTxjDgpn3wA",
  authDomain: "phamille.firebaseapp.com",
  databaseURL: "https://phamille-default-rtdb.firebaseio.com",
  projectId: "phamille",
  storageBucket: "phamille.firebasestorage.app",
  messagingSenderId: "183021771306",
  appId: "1:183021771306:web:8cf9af194dac12ad630153"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let username = "", roomName = "", db;

function joinRoom() {
  username = document.getElementById("username").value;
  roomName = document.getElementById("room-name-input").value;
  const password = document.getElementById("password-input").value;

  if (!username || !roomName || !password) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  db = firebase.database().ref("rooms/" + roomName);

  db.once("value").then(snapshot => {
    if (snapshot.exists()) {
      const savedPassword = snapshot.child("password").val();
      if (savedPassword !== password) {
        alert("Mot de passe incorrect !");
        return;
      }
    } else {
      db.set({ password: password });
    }

    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    document.getElementById("room-name-display").textContent = "Salle : " + roomName;

    firebase.database().ref("rooms/" + roomName + "/onlineUsers/" + username).set({
      status: "en ligne",
      lastSeen: Date.now()
    });

    firebase.database().ref("rooms/" + roomName + "/onlineUsers").on("child_added", snap => {
      const li = document.createElement("li");
      li.textContent = snap.key;
      document.getElementById("online-users").appendChild(li);
    });

    firebase.database().ref("rooms/" + roomName + "/messages").on("child_added", snap => {
      const msg = snap.val();
      const div = document.createElement("div");
      div.textContent = msg.user + ": " + msg.message;
      document.getElementById("messages").appendChild(div);
    });
  });
}

function sendMessage() {
  const message = document.getElementById("message-input").value;
  if (!message) return;
  firebase.database().ref("rooms/" + roomName + "/messages").push({
    user: username,
    message: message,
    timestamp: Date.now()
  });
  document.getElementById("message-input").value = "";
}
