# Firebase Setup Instructions

This application uses Firebase for authentication, database, and storage. Follow these steps to set up Firebase for your development environment:

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the prompts to create a new project
3. Enable Google Analytics if desired (optional)

## 2. Register Your Web App

1. In the Firebase project dashboard, click the web icon (</>) to add a web app
2. Give your app a nickname and register it
3. Copy the firebaseConfig object - you'll need this for your .env file

## 3. Enable Authentication Methods

1. In the Firebase console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Optionally enable other authentication methods as needed

## 4. Create Firestore Database

1. Go to Firestore Database in the Firebase console
2. Click "Create database"
3. Choose "Start in production mode" and select a location closest to your users
4. Set up security rules to secure your database

## 5. Configure Your Environment

1. Create a `.env` file in the root of the client directory
2. Add the following variables with your Firebase configuration values: 