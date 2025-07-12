// main.js
import { db, auth } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

const authForm = document.getElementById("auth-form");
const bookingForm = document.getElementById("booking-form");
const appointmentsDiv = document.getElementById("appointments");
const adminPanel = document.getElementById("admin-panel");
const adminAppointmentList = document.getElementById("admin-appointment-list");
const logoutBtn = document.getElementById("logout-btn");
const appointmentList = document.getElementById("appointment-list");

const appointmentsRef = collection(db, "appointments");
const adminEmails = ["admin@example.com"];

authForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-login-credentials"
    ) {
      const register = confirm("No account found. Would you like to register?");
      if (register) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          alert("Account created successfully!");
        } catch (signupError) {
          alert("Sign-up failed: " + signupError.message);
        }
      }
    } else {
      alert("Login failed: " + error.message);
    }
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  location.reload();
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    authForm.style.display = "none";
    logoutBtn.style.display = "inline-block";
    const isAdmin = adminEmails.includes(user.email);

    if (isAdmin) {
      adminPanel.style.display = "block";
      loadAdminAppointments();
    } else {
      bookingForm.style.display = "block";
      appointmentsDiv.style.display = "block";
      fetchUserAppointments();
    }
  }
});

bookingForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const email = auth.currentUser.email;

  try {
    await addDoc(appointmentsRef, {
      name,
      email,
      date,
      time,
      status: "pending",
    });
    alert("Appointment booked successfully!");
    bookingForm.reset();
    fetchUserAppointments();
  } catch (error) {
    console.error("Error booking appointment:", error);
  }
});

async function fetchUserAppointments() {
  appointmentList.innerHTML = "";
  const querySnapshot = await getDocs(appointmentsRef);
  querySnapshot.forEach((docSnap) => {
    const appointment = docSnap.data();
    if (appointment.email === auth.currentUser.email) {
      const li = document.createElement("li");
      const statusClass = appointment.status === "approved" ? "approved" : "pending";
      li.innerHTML = `<strong>${appointment.name}</strong> - ${appointment.date} - ${appointment.time} <span class="${statusClass}">[${appointment.status}]</span>`;
      appointmentList.appendChild(li);
    }
  });
}

async function loadAdminAppointments() {
  adminAppointmentList.innerHTML = "";
  const querySnapshot = await getDocs(appointmentsRef);
  querySnapshot.forEach((docSnap) => {
    const appointment = docSnap.data();
    const li = document.createElement("li");
    const statusClass = appointment.status === "approved" ? "approved" : "pending";
    li.innerHTML = `<strong>${appointment.name}</strong> - ${appointment.email} - ${appointment.date} - ${appointment.time} <span class="${statusClass}">[${appointment.status}]</span>`;

    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveBtn.onclick = async () => {
      await updateDoc(doc(db, "appointments", docSnap.id), {
        status: "approved",
      });
      loadAdminAppointments();
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      await deleteDoc(doc(db, "appointments", docSnap.id));
      loadAdminAppointments();
    };

    const controls = document.createElement("span");
    controls.className = "admin-controls";
    controls.appendChild(approveBtn);
    controls.appendChild(delBtn);

    li.appendChild(controls);
    adminAppointmentList.appendChild(li);
  });
}
