# MindPocket Backend

Backend for **MindPocket** — a personal notes and link management app that allows users to save, organize, tag, and optionally share notes and resources publicly.  
Built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features

- **User Authentication**
  - Sign up and sign in with secure password hashing (bcrypt)
  - JWT-based authentication

- **Content Management**
  - Create, read, update, and delete notes, links, and articles
  - Add multiple **tags** to content for easy categorization
  - Toggle **public/private** visibility
  - Generate **shareable links** for public notes

- **Shareable Notes**
  - Unique URL generated using UUID when content is marked as public
  - Access public content via `/share/:shareableId`

---

## Tech Stack

- **Node.js** & **TypeScript**
- **Express.js** for REST API
- **MongoDB** with Mongoose for database
- **bcrypt** for password hashing
- **JWT** for authentication
- **uuid** for generating unique shareable links
- **dotenv** for environment configuration

---

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/anubhawdwd/mindpocket-backend.git
cd mindpocket-backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```ini
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mindpocket
JWT_SECRET="your_jwt_secret"
BaseURL="http://localhost:3000/share/"
```

4. Run the server:

```bash
npm run dev
# or
ts-node index.ts
```

The server should now be running on `http://localhost:3000`.

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/api/v1/signup` | Register a new user     |
| POST   | `/api/v1/signin` | Login and get JWT token |

### Content

> All content routes require JWT in `Authorization` header.

| Method | Endpoint                       | Description                                                        |
| ------ | ------------------------------ | ------------------------------------------------------------------ |
| GET    | `/api/v1/content`              | Get all content for the authenticated user                         |
| POST   | `/api/v1/content`              | Add new content (title, link, notes, tags, isPublic)               |
| PUT    | `/api/v1/content/:id`          | Update content by ID                                               |
| DELETE | `/api/v1/content/:id`          | Delete content by ID                                               |
| POST   | `/api/v1/content/:id/isPublic` | Toggle public/private visibility; returns shareable link if public |
| GET    | `/share/:shareableId`          | Access public content by shareable link                            |

---
## Environment Variables

| Variable      | Description                                |
| ------------- | ------------------------------------------ |
| `PORT`        | Port number to run the server (e.g., 3000) |
| `MONGODB_URI` | MongoDB connection URI                     |
| `JWT_SECRET`  | Secret key for JWT authentication          |
| `BaseURL`     | Base URL for generating shareable links    |
---

## 🧪 Postman Testing Guide

You can use **Postman** (or any API client) to test the MindPocket backend API.

> 🔐 All content-related endpoints require a **JWT token** obtained from the `/signin` endpoint. Include it in the `Authorization` header as `Bearer <your_token>`.

---

### 1️⃣ Sign Up

**Endpoint**
```
POST http://localhost:<PORT>/api/v1/signup
```

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{
  "userName": "john123",
  "password": "securePassword"
}
```

**Response**
```json
{
  "message": "Registered Successfully"
}
```

---

### 2️⃣ Sign In

**Endpoint**
```
POST http://localhost:<PORT>/api/v1/signin
```

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{
  "userName": "john123",
  "password": "securePassword"
}
```

**Response**
```json
{
  "message": "Welcome john123",
  "jwt_token": "<your_jwt_token_here>"
}
```

---

### 3️⃣ Add Content

**Endpoint**
```
POST http://localhost:<PORT>/api/v1/content
```

**Headers**
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Body**
```json
{
  "title": "My Notes",
  "link": "https://example.com/article",
  "notes": "Some important notes here.",
  "tags": ["javascript", "nodejs"],
  "isPublic": true
}
```

**Response**
```json
{
  "message": "Saved"
}
```

---

### 4️⃣ Get User Content

**Endpoint**
```
GET http://localhost:<PORT>/api/v1/content
```

**Headers**
```
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "content": [
    {
      "_id": "64f8a1c3a5b8f7d1d2e4b123",
      "title": "My Notes",
      "link": "https://example.com/article",
      "notes": "Some important notes here.",
      "tags": ["javascript", "nodejs"],
      "isPublic": true,
      "shareableId": "123e4567-e89b-12d3-a456-426614174000",
      "createdAt": "2025-10-13T10:00:00.000Z",
      "updatedAt": "2025-10-13T10:05:00.000Z"
    }
  ]
}
```

---

### 5️⃣ Toggle Public/Private

**Endpoint**
```
POST http://localhost:<PORT>/api/v1/content/:id/isPublic
```

> Replace `:id` with the actual content ID.

**Headers**
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Body**
```json
{
  "isPublic": true
}
```

**Response**
```json
{
  "message": "Your Note is now Public",
  "shareableLink": "http://localhost:3000/share/123e4567-e89b-12d3-a456-426614174000"
}
```

---

### 6️⃣ Access Shared Content

**Endpoint**
```
GET http://localhost:<PORT>/share/:shareableId
```

> Replace `:shareableId` with the actual shareable ID.

**Response**
```json
{
  "content": {
    "_id": "64f8a1c3a5b8f7d1d2e4b123",
    "title": "My Notes",
    "link": "https://example.com/article",
    "notes": "Some important notes here.",
    "tags": ["javascript", "nodejs"],
    "isPublic": true,
    "shareableId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-10-13T10:00:00.000Z",
    "updatedAt": "2025-10-13T10:05:00.000Z"
  }
}
```

---

> 💡 **Tip:** Always replace `<PORT>` with the actual port your server is running on (e.g., `3000`) and ensure your JWT token is valid before testing protected routes.



## License

This project is licensed under the **MIT License**.

