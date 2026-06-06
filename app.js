let miningActive = false;
let miningSeconds = 43200;
let miningTimer = null;

let realBalance = 0;
const totalReward = 120;
const totalDuration = 43200;

async function startMining(){

   if(!window.auth.currentUser){

      showToast("Silakan login terlebih dahulu");
      return;

   }

   if(miningActive) return;

    miningActive = true;

    const uid =
window.auth.currentUser.uid;

await window.updateDoc(
  window.doc(window.db,"users",uid),
  {
  miningStart: window.serverTimestamp(),
  miningActive: true
}
);

    document.getElementById("statusText").innerText =
    "MINING";

    document.getElementById("mineBtn").innerHTML =
    "⏳ MINING ACTIVE";

    document.getElementById("mineBtn").disabled =
    true;

    miningSeconds = 43200;

document.getElementById("miningTimer").style.display =
"block";

    startMiningTimer();
}
window.startMining = startMining;
function startMiningTimer(){
clearInterval(miningTimer);
    miningTimer = setInterval(async ()=>{

        miningSeconds--;

        let h =
        Math.floor(miningSeconds / 3600);

        let m =
        Math.floor((miningSeconds % 3600) / 60);

        let s =
        miningSeconds % 60;

        let percent =
        ((43200 - miningSeconds) / 43200) * 100;
const earned =
((totalDuration - miningSeconds) / totalDuration)
* totalReward;
document.getElementById("earningText")
.innerText =
"+" +
Number(earned).toLocaleString(
"id-ID",
{
maximumFractionDigits:2
}
)
+
" Ⱡ";

const displayBalance =
realBalance + earned;

document.getElementById("balanceValue")
.innerText =
formatLEXA(displayBalance);
        document.getElementById("progressBar").style.width =
        percent + "%";

        document.getElementById("miningTimer").innerHTML =
        "Mining Time: " +
        String(h).padStart(2,"0") + ":" +
        String(m).padStart(2,"0") + ":" +
        String(s).padStart(2,"0");

        if(miningSeconds <= 0){
document.getElementById("earningText")
.innerText =
"+0.00 LEXA";
            clearInterval(miningTimer);

            const uid =
window.auth.currentUser.uid;

const data =
await window.loadUserData(uid);

document.getElementById("userName")
.innerText =
data.username || "Member";

realBalance = data.balance;

await window.updateDoc(
   window.doc(window.db,"users",uid),
   {
   balance: window.increment(totalReward),
   miningStart:0,
   miningActive:false
}
);

const updatedData =
await window.loadUserData(uid);

realBalance =
updatedData.balance;

document.getElementById("balanceValue")
.innerText =
formatLEXA(realBalance);

            document.getElementById("statusText").innerText =
            "READY";

            document.getElementById("mineBtn").innerHTML =
            "⛏ START MINING";

            document.getElementById("mineBtn").disabled =
            false;

            document.getElementById("progressBar").style.width =
            "0%";

            document.getElementById("miningTimer").innerHTML =
            "Mining Time: 12:00:00";
document.getElementById("miningTimer").style.display =
"none";
            miningActive = false;
        }

    },1000);
}
async function registerUser(){

   const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

   try{

      const result =
      await window.createUserWithEmailAndPassword(
         window.auth,
         email,
         password
      );

      const uid =
      result.user.uid;
const referralUsed =
document.getElementById("referralInput")
.value.trim().toUpperCase();
      showToast("🎉 Akun berhasil dibuat");

switchAuthTab("login");

      const userRef =
      window.doc(window.db,"users",uid);

      const referralCode =
uid.substring(0,8).toUpperCase();

await window.setDoc(userRef,{
   username:
   document.getElementById("username").value,

   balance:0,
   miningStart:0,
   miningActive:false,

   referredBy: referralUsed || "",
   referralCode: referralCode,

   referrals:0,
   referredUsers:[]
});
if(referralUsed){

   const q = window.query(
      window.collection(window.db,"users"),
      window.where(
         "referralCode",
         "==",
         referralUsed
      )
   );

   const snap =
   await window.getDocs(q);

   if(snap.empty){

      showToast("Kode referral tidak ditemukan");
      return;
   }

   snap.forEach(async(refUser)=>{

   await window.updateDoc(
      refUser.ref,
      {
         referrals: window.increment(1),
         balance: window.increment(25),
         referredUsers: window.arrayUnion(
            document.getElementById("username").value
         )
      }
   );

});
}

}catch(err){

      showToast(err.message);

   }

}
async function loginUser(){

   const email =
document.getElementById("loginEmail").value;

const password =
document.getElementById("loginPassword").value;

   try{

      await window.signInWithEmailAndPassword(
         window.auth,
         email,
         password
      );

      showToast("✅ Login berhasil");

   }catch(err){

      showToast(err.message);

   }

}
function switchAuthTab(type){

document.getElementById("loginForm")
.style.display =
type === "login"
? "block"
: "none";

document.getElementById("registerForm")
.style.display =
type === "register"
? "block"
: "none";

document.getElementById("loginTab")
.classList.toggle(
"active",
type === "login"
);

document.getElementById("registerTab")
.classList.toggle(
"active",
type === "register"
);

}
function openUsernameModal(){

document.getElementById(
"usernameModal"
).classList.add("show");

}
function closeUsernameModal(){

document.getElementById(
"usernameModal"
).classList.remove("show");

}
async function saveUsername(){

const newName =
document.getElementById(
"newUsernameInput"
).value.trim();

if(!newName){

showToast("Masukkan username baru");
return;

}

const uid =
window.auth.currentUser.uid;

const data =
await window.loadUserData(uid);

if(data.usernameChanged){

showToast(
"Username hanya bisa diubah 1 kali"
);

closeUsernameModal();
return;

}

await window.updateDoc(
window.doc(window.db,"users",uid),
{
username:newName,
usernameChanged:true
}
);

document.getElementById("userName")
.innerText = newName;

document.getElementById("profileName")
.innerText = newName;

document.getElementById("profileUsername")
.innerText = newName;

closeUsernameModal();

showToast(
"✅ Username berhasil diperbarui"
);

}
function showToast(message){

const toast =
document.getElementById("toast");

toast.innerText = message;

toast.style.display = "block";

setTimeout(()=>{
toast.classList.add("show");
},10);

setTimeout(()=>{
toast.classList.remove("show");

setTimeout(()=>{
toast.style.display="none";
},300);

},2500);

}
async function logoutUser(){

   clearInterval(miningTimer);

   miningActive = false;
   miningSeconds = 43200;
   realBalance = 0;
document.getElementById("earningText")
.innerText =
"+0.00 LEXA";
document.getElementById("progressBar")
.style.width = "0%";

document.getElementById("miningTimer")
.style.display = "none";

document.getElementById("statusText")
.innerText = "GUEST";

document.getElementById("mineBtn")
.innerHTML = "⛏ LOGIN TO START";
   await window.signOut(window.auth);
}
function copyReferral(){

 const code =
 document.getElementById("referralCode")
 .innerText;

 navigator.clipboard.writeText(code);

 showToast("Referral berhasil disalin");
}
function formatLEXA(amount){

   return "Ⱡ " +
   Number(amount).toLocaleString(
      "id-ID",
      {
         minimumFractionDigits: 0,
         maximumFractionDigits: 2
      }
   );

}
function openEmailModal(){

document.getElementById(
"emailModal"
).classList.add("show");

}

function closeEmailModal(){

document.getElementById(
"emailModal"
).classList.remove("show");

}
async function changeEmail(){

const newEmail =
document.getElementById(
"newEmailInput"
).value.trim();

const password =
document.getElementById(
"confirmPasswordInput"
).value;

if(!newEmail || !password){

showToast(
"Lengkapi semua data"
);

return;

}

try{

const user =
window.auth.currentUser;

const credential =
window.EmailAuthProvider.credential(
user.email,
password
);

await window.reauthenticateWithCredential(
user,
credential
);

await window.updateEmail(
user,
newEmail
);

document.getElementById(
"profileEmail"
).innerText =
newEmail;

closeEmailModal();

showToast(
"✅ Email berhasil diperbarui"
);

}catch(err){

showToast(
"Gagal: " + err.message
);

}
}
function showPage(id,el){

   document.querySelectorAll(".page")
   .forEach(p=>p.classList.remove("active"));

   document.getElementById(id)
   .classList.add("active");

   if(el && el.classList.contains("nav-item")){

      document.querySelectorAll(".nav-item")
      .forEach(i=>i.classList.remove("active"));

      el.classList.add("active");
   }

}
window.startMining = startMining;

window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;

window.switchAuthTab = switchAuthTab;

window.openUsernameModal = openUsernameModal;
window.closeUsernameModal = closeUsernameModal;
window.saveUsername = saveUsername;

window.openEmailModal = openEmailModal;
window.closeEmailModal = closeEmailModal;
window.changeEmail = changeEmail;

window.copyReferral = copyReferral;
window.showPage = showPage;

const app = initializeApp(firebaseConfig);

window.auth = getAuth(app);
window.createUserWithEmailAndPassword =
createUserWithEmailAndPassword;

window.signInWithEmailAndPassword =
signInWithEmailAndPassword;

window.signOut =
signOut;

window.onAuthStateChanged =
onAuthStateChanged;
window.db = getFirestore(app);

window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.updateDoc = updateDoc;
window.increment = increment;
window.collection = collection;
window.arrayUnion = arrayUnion;
window.query = query;
window.where = where;
window.getDocs = getDocs;
window.serverTimestamp =
serverTimestamp;
window.updateEmail =
updateEmail;

window.EmailAuthProvider =
EmailAuthProvider;

window.reauthenticateWithCredential =
reauthenticateWithCredential;