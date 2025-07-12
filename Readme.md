# Student-Teacher Booking Appointment

This is a Firebase-powered web app that allows students to book appointments and teachers (admins) to approve or manage them via an admin dashboard.

## 🚀 Features

* Student registration and login with Firebase Auth
* Students can book date/time-based appointments
* Admin users can approve or delete appointments
* All data is stored in Firebase Firestore

## 🛠️ Technologies Used

* HTML, CSS, JavaScript
* Firebase Authentication & Firestore
* Firebase Modular SDK (v9)

## 📁 File Structure

```
├── index.html           # App UI and form
├── style.css            # Page styling
├── main.js              # Application logic (auth, Firestore actions)
├── firebase-config.js   # Firebase initialization
├── README.md            # Project description
```

## 🔧 Getting Started

1. Clone or download this project
2. Replace the Firebase config values in `firebase-config.js`
3. Enable Email/Password authentication in Firebase console
4. Create a Firestore database and use development rules (see below)

## 🔐 Firestore Rules (Dev Only)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 8, 8);
    }
  }
}
```

## 👩‍🏫 Admin Access

Admin emails are defined in `main.js`:

```js
const adminEmails = ['admin@example.com'];
```

Update that list with real teacher/admin emails.

## 📌 Future Improvements

* Password reset support
* Pagination/filter for admin panel
* Firebase Hosting support
* Email notifications via Firebase Functions

## 📜 License

MIT License — Free to use and adapt.
