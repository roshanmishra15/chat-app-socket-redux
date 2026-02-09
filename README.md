
# 💬 Real-Time Chat Application (Redux + Socket.IO)

A full-stack real-time chat application built using **React**, **Redux Toolkit**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.
It supports **Global Chat**, **Private Chat**, real-time **online status**, **typing indicator**, **read/delivered ticks**, **file sharing**, **emoji picker**, and **profile picture upload**.

---

## 🚀 Features

### 🔐 Authentication

* User Register
* User Login (JWT Authentication)
* Secure protected routes

### 🌍 Global Chat

* Everyone can send and receive messages in real-time

### 👤 Private Chat

* One-to-one real-time chat between users

### 🟢 Online Users

* Shows online users in real-time
* Current user is hidden from online list

### ✍️ Typing Indicator

* Shows when another user is typing in private chat

### ✅ Delivered & Read Status

* Single tick → Sent
* Double tick → Delivered
* Blue double tick → Read

### 📌 Recent Chats

* Stores last conversation preview
* Shows last message time
* Supports file message preview

### 🔍 Search Users

* Search inside recent chats and online users

### 😀 Emoji Picker

* Users can send emojis in messages

### 📎 File Upload (Multer)

* Supports sending:

  * Images (png, jpg)
  * PDFs
  * DOC/DOCX
  * Any attachment file
* Download option available

### 🖼️ Profile Picture Upload

* Upload profile image
* Stored in MongoDB and persists after refresh

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Tailwind CSS
* Axios
* Emoji Picker React

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.IO
* Multer
* JWT Authentication

---

## 📂 Folder Structure

```
Redux And Socket/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── Routes/
│   ├── socket/
│   ├── uploads/
│   └── index.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── redux/
│   └── socket/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd Redux-And-Socket
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend server:

```bash
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔥 Socket.IO Events Used

### Global Chat

* `send-global-message`
* `new-global-message`

### Private Chat

* `send-private-message`
* `new-private-message`

### Typing Feature

* `typing`
* `stop-typing`

### Message Status

* `mark-as-delivered`
* `mark-as-read`

### Online Users

* `online-users`

---

## 📌 API Routes

### Auth Routes

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/getme`

### Message Routes

* `GET /api/messages/global`
* `GET /api/messages/private/:receiverId`
* `GET /api/messages/recent`

### Upload Routes

* `POST /api/upload`

### Profile Upload

* `POST /api/user/upload-profile`

---

## 📸 Screenshots

(Add your screenshots here later)

---

## 👨‍💻 Author

**Roshan Mishra**
Full Stack Developer (React + Node.js)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.


