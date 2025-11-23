# Mobile Wallet App

**Mobile Wallet App** is a cross-platform mobile application built with **React Native (Expo)** that allows users to manage their wallet, send and receive money, and track transaction history. The app connects to the **Wallet API** backend for all wallet operations.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Getting Started](#getting-started)  
- [API Integration](#api-integration)  
- [Example API Requests](#example-api-requests)  
- [Screenshots](#screenshots)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)

---

## Features

- User registration and login  
- JWT-based authentication  
- View wallet balance  
- Send and receive money  
- Transaction history  
- Responsive UI for mobile devices  

---

## Tech Stack

- **Framework:** React Native with Expo  
- **Language:** TypeScript / JavaScript  
- **Navigation:** React Navigation  
- **State Management:** React Context / Hooks  
- **Networking:** Axios (for API requests)  
- **Styling:** Styled Components / CSS-in-JS  
- **Backend API:** [Wallet API](https://github.com/DeepakNagar1757/Wallet-Api)  

---

## Project Structure

Mobile/
├── app/ # Main app entry points
├── assets/ # Images, icons, fonts
├── components/ # Reusable UI components
├── constants/ # App constants (colors, fonts)
├── hooks/ # Custom hooks
├── lib/ # API calls, utilities
├── node_modules/ # Dependencies
├── App.tsx # App root
├── package.json # Project metadata & scripts
├── tsconfig.json # TypeScript config
└── .env # Environment variables (API URL, keys)

yaml
Copy code

---

## Getting Started

### Prerequisites

- Node.js (v16+) and npm/yarn  
- Expo CLI installed globally:
```bash
npm install -g expo-cli
Access to Wallet API backend

Installation
bash
Copy code
git clone https://github.com/DeepakNagar1757/Mobile.git
cd Mobile
npm install   # or yarn install
Environment Variables
Create a .env file in the root directory:

ini
Copy code
API_BASE_URL=https://your-backend-url.com/api
Running the App
bash
Copy code
# Start the Expo development server
npm start   # or expo start
Then run the app on:

Android Emulator / Device

iOS Simulator / Device

Expo Go App

API Integration
The app communicates with the Wallet API backend for all wallet-related features. Make sure the backend is running locally or deployed, and the API_BASE_URL is correctly set in .env.

Example API Requests
1. Register a new user
http
Copy code
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
2. Login
http
Copy code
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
3. Get Wallet Balance
http
Copy code
GET /api/wallet/balance
Authorization: Bearer <your_token_here>
4. Send Money
http
Copy code
POST /api/wallet/transfer
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "toUserId": "user_5678",
  "amount": 100
}
5. View Transaction History
http
Copy code
GET /api/wallet/transactions
Authorization: Bearer <your_token_here>
Note: Replace <your_token_here> with the JWT received after login.

Contributing
We welcome contributions!

Fork the repository

Create a branch: feature/<your-feature>

Make your changes and commit

Push to your fork and open a Pull Request

License
MIT License © 2025 Deepak Nagar

Contact
GitHub: DeepakNagar1757

Email: your_email@example.com

Backend API Repo: Wallet API
