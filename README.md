# AI Event Concierge — Frontend

> Submission for **LOUDER** Full Stack Engineer Intern Assignment  
> Built by **Divanshu Kachhawa** · divanshu1704@gmail.com

## 🔗 Live Demo

**Frontend:** https://loudr-submission-frontend1.vercel.app  
**Backend API:** https://loudr-submission-backend-1.onrender.com

---

## 🧠 What It Does

A full-stack AI-powered platform that takes a natural language description of any event and returns a structured venue proposal — including venue name, location, estimated cost, a "why it fits" justification, and highlights.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Framer Motion, Axios |
| Styling | Tailwind CSS + custom CSS-in-JS |
| Font | Syne (Google Fonts) |
| Deployment | Vercel |

---

## ✨ Features

- 🔍 Natural language event input with animated search bar
- ⚡ Real-time AI-generated venue proposals
- ✦ Highlights section per venue recommendation
- 🕘 Persistent search history (survives page refresh)
- 💀 Skeleton shimmer loading state
- 🎨 Fully animated UI with Framer Motion (3D card tilt, stagger, ripple)
- 📱 Fully responsive (mobile + desktop)

---

## 🚀 Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/Divanshu17/loudr-submission-frontend.git
cd loudr-submission-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file in the root
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start the app
```bash
npm start
```

The app runs at `http://localhost:3000`

> Make sure the backend is also running locally on port 5000, or point `REACT_APP_API_URL` to the live Render URL.

---

## 📁 Project Structure

```
src/
└── App.jsx        # All components — Navbar, Hero, SearchInput,
                   # ResultCard, HistoryCard, Footer, LoadingState
```

---

## 🔌 API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate-event` | Send event description, get AI venue proposal |
| `GET` | `/api/history` | Fetch all previous searches |