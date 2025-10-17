# IdentiCore - Secure Identity Management System

Identicore is a lightweight, secure web application that allows users to manage multiple online identities, aliases, and platform-specific personas. The system emphasizes privacy, encryption, and user control, and user control, making it suitable for content creators, professionals, and individuals concerned about context collapse in digital spaces.

```

## Features
JWT-based authentication and Bcrypt-hashed passwords
Context tagging (for example, Professional, Anonymous)
Manage aliases accross platforms (LinkedIn, GitHub, Instagram)
AES-256 encryption of sensitive data (for example, addresses)
Reminder system with opt-in banners and dashboard stats
Responsive user interface with dark or light theme toggle

```
## Video Demonstration
https://youtu.be/ivy_cK7e0Yg

## API Testing
All backend API endpoints were tested using Postman
POST /auth/register - User Registration
POST /auth/login - JWT Issuance
GET /profile/me - Encrypted profile retrieval
PUT /settings/profile - Update profile
PUT /settings/reminder - Reminder settings
DELETE /me - Delete account

## Installation instructions

Step 1: Install MongoDB compass at: https://www.mongodb.com/try/download/compass

Step 2: Make identicore directory
Open command prompt terminal
Run: mkdir identicore

Step 3: Navigate to the folder
Run: cd identicore

Step 4: Install git at: https://git-scm.com/downloads

Step 5: Set up git
Check git is on your system
Run: git -v

Step 6: Initialize git into your project
Run: git init

Step 7: Clone the repository
git clone https://github.com/BryanLoooo/IdentiCore.git

Step 8: Install backend dependencies
Run: npm install

Step 9: Set up .env
Create a .env file and include:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/identicore
JWT_SECRET=supersecurekey
AES_SECRET=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
AES_IV=abcdef9876543210abcdef9876543210       

Step 10: Start the server
node server.js

