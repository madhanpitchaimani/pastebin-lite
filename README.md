# Pastebin Lite

This is a backend-only Pastebin-like application built as part of a take-home assignment.

Users can create a text paste and receive a shareable URL to view it.  
Each paste can optionally expire based on time (TTL) or number of views.

---

## Features

- Create a paste with arbitrary text
- Generate a shareable URL for each paste
- View paste content via API or browser
- Optional time-based expiry (TTL)
- Optional view-count limit
- Automatic invalidation when constraints are met
- Safe HTML rendering (no script execution)

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose

---

## API Endpoints

### Health Check
