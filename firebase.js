<script type="module">

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
 getFirestore,
 doc,
 getDoc,
 setDoc,
 updateDoc,
 increment,
 query,
 where,
 getDocs,
 collection,
 arrayUnion
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCqEdDDiACoU3aIYYgYGDZ48_x-1YFJ9jc",
  authDomain: "lexa-network.firebaseapp.com",
  projectId: "lexa-network",
  storageBucket: "lexa-network.firebasestorage.app",
  messagingSenderId: "471101991726",
  appId: "1:471101991726:web:7ba21aee8b3d64337e28bf"
};


async function loadUserData(uid){

  const userRef =
  doc(window.db,"users",uid);

  const snap =
  await getDoc(userRef);

  if(!snap.exists()){

    await setDoc(userRef,{
   balance:0,
   miningStart:0,
   miningActive:false
});
    return {
   balance:0,
   miningStart:0,
   miningActive:false
};
  }

  return snap.data();
}
window.loadUserData = loadUserData;
window.onAuthStateChanged(
   window.auth,
   async(user)=>{

      if(!user){

   document.getElementById("userName")
   .innerText = "Guest";

   document.getElementById("authPage")
   .style.display = "block";

   document.getElementById("logoutBox")
   .style.display = "none";

   realBalance = 0;

   document.getElementById("balanceValue")
   .innerText = "0.00";

   document.getElementById("statusText")
   .innerText = "GUEST";

   document.getElementById("mineBtn")
   .innerHTML = "⛏ LOGIN TO START";

   document.getElementById("mineBtn")
   .disabled = false;

   // reset halaman profile
   document.getElementById("profileName")
   .innerText = "Guest";

   document.getElementById("profileUsername")
   .innerText = "-";

   document.getElementById("profileEmail")
   .innerText = "-";

   document.getElementById("profileId")
   .innerText = "LEXA ID";

   return;
}
showPage(
"home",
document.querySelector(".nav-item")
);

showToast("Selamat datang kembali");

      document.getElementById("authPage")
      .style.display = "none";

      document.getElementById("logoutBox")
      .style.display = "block";

      document.getElementById("balanceValue")
      .innerText = "0";

      document.getElementById("statusText")
      .innerText = "READY";

      document.getElementById("mineBtn")
      .innerHTML = "⛏ START MINING";

      document.getElementById("mineBtn")
      .disabled = false;

      document.getElementById("miningTimer")
      .style.display = "none";

      const uid = user.uid;
const data = await window.loadUserData(uid);

document.getElementById("profileName")
.innerText =
data.username || "Member";

document.getElementById("profileUsername")
.innerText =
data.username || "-";

document.getElementById("profileEmail")
.innerText =
user.email || "-";

document.getElementById("profileId")
.innerText =
"LEXA ID • " +
user.uid.substring(0,8).toUpperCase();

document.getElementById("referralCode")
.innerText =
data.referralCode || "-";

document.getElementById("referralCount")
.innerText =
data.referrals || 0;

document.getElementById("homeReferralCount")
.innerText =
data.referrals || 0;

realBalance = data.balance;

document.getElementById("userName")
.innerText =
data.username || "Member";

document.getElementById("balanceValue")
.innerText =
formatLEXA(realBalance);
const list =
document.getElementById("referralList");

if(
   data.referredUsers &&
   data.referredUsers.length
){

   list.innerHTML =
   data.referredUsers
   .map(name =>
      "👤 " + name
   )
   .join("<br>");

}else{

   list.innerHTML =
   "Belum ada referral";

}
      // lanjutkan kode mining recovery milikmu di sini...
      if(
   data.miningActive &&
   typeof data.miningStart?.toMillis === "function"
){
    
    const miningStartMs =
    data.miningStart.toMillis();

    const elapsedSeconds =
    Math.floor(
      (Date.now() - miningStartMs) / 1000
    );

    const MAX_SECONDS = 43200;

    // mining selesai
    if(elapsedSeconds >= MAX_SECONDS){

        await window.updateDoc(
          window.doc(window.db,"users",uid),
          {
             balance: window.increment(120),
             miningStart: 0,
             miningActive: false
          }
        );

        const updatedData =
        await window.loadUserData(uid);

        realBalance =
        updatedData.balance;

        document.getElementById("balanceValue")
.innerText =
formatLEXA(realBalance);
       document.getElementById("statusText")
.innerText = "READY";

document.getElementById("mineBtn")
.innerHTML = "⛏ START MINING";

document.getElementById("mineBtn")
.disabled = false;

document.getElementById("miningTimer")
.style.display = "none";

document.getElementById("progressBar")
.style.width = "0%";

    }else{

    miningActive = true;

    miningSeconds =
    MAX_SECONDS - elapsedSeconds;

    const percent =
    (elapsedSeconds / MAX_SECONDS) * 100;

    document.getElementById("progressBar")
    .style.width = percent + "%";

    document.getElementById("statusText")
    .innerText = "MINING";

    document.getElementById("mineBtn")
    .innerHTML = "⏳ MINING ACTIVE";

    document.getElementById("mineBtn")
    .disabled = true;

    document.getElementById("miningTimer")
    .style.display = "block";

    startMiningTimer();

    }
}
      document.getElementById("authPage")
      .style.display = "none";
   }
);