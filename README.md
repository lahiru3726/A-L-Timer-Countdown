AL EXAM TIMER

AL EXAM TIMER is a web-based countdown system created for Advanced Level (A/L) students. The purpose of this project is to help students stay aware of the remaining time until their examination while providing a clean, motivating, and distraction-free interface.

The application consists of two separate sections:

- **Countdown Page** – visible to students.
- **Admin Page** – used to set or update the exam date and time.

Whenever the administrator changes the target date, every user viewing the countdown automatically receives the updated timer. Because the countdown is calculated using the stored target date rather than the user's local device time, the timer continues correctly even after refreshing the page or reopening the website.

---

## Project Overview

Preparing for A/L examinations can be stressful, and students often lose track of how much time remains before the exam. This project was developed to provide a visual reminder that encourages students to stay focused and motivated throughout their preparation period.

The interface is inspired by modern circular countdown designs and was built with responsiveness in mind, allowing it to work smoothly on mobile phones, tablets, laptops, and desktop computers without requiring scrolling.

In addition to showing the remaining time, the system displays motivational messages that change periodically to encourage students during their studies.

---

## Main Features

### 📌 Student Countdown Interface

The countdown page includes:

- Full-screen responsive layout
- Circular progress indicator
- Dynamic countdown display
- Years, months, days section
- Hours, minutes, seconds section
- Automatic layout adjustment when certain time units are not needed
- Color transition as the exam date approaches
- Motivational messages that change automatically
- No scrolling required on any screen size

---

### 📌 Administrator Panel

The administrator page allows users to:

- Select an exam date using a calendar picker
- Set the examination time
- Save the countdown target
- Instantly update the timer shown to all users

---

### 📌 Database Integration

MongoDB is used to store the exam date and time. This ensures that:

- The countdown remains accurate after page refreshes.
- Every student sees the same remaining time.
- Users joining later still receive the correct countdown.
- The timer is not dependent on when the page was opened.

---

## Technologies Used

This project was developed using:

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

---

## Folder Structure

```text
al-exam-timer/
│
├── server.js
├── .env
├── package.json
│
├── models/
│      Timer.js
│
├── routes/
│      timerRoutes.js
│
├── public/
│
│   ├── countdown/
│   │      index.html
│   │      style.css
│   │      script.js
│   │
│   ├── admin/
│   │      index.html
│   │      style.css
│   │      script.js
│   │
│   └── fonts/
│          Microsport.ttf
```

---

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/al-exam-timer.git
```

Move into the project directory:

```bash
cd al-exam-timer
```

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Configure MongoDB

Make sure MongoDB is installed and running on your computer.

Create a `.env` file and add:

```env
MONGO_URI=mongodb://127.0.0.1:27017/alexamtimer
```

---

### Step 4: Start the Server

```bash
node server.js
```

After starting the server, open:

**Student Countdown Page**

```text
http://localhost:3000/countdown
```

**Administrator Page**

```text
http://localhost:3000/admin
```

---

## How the System Works

1. The administrator chooses the exam date and time.
2. The selected information is sent to the server.
3. MongoDB stores the target date.
4. The countdown page retrieves the stored value.
5. JavaScript calculates the remaining time continuously.
6. Every connected user sees the same synchronized countdown.

---

## Responsive Design

This project was designed to fit different screen sizes automatically. The interface works properly on:

- Mobile phones
- Tablets
- Laptops
- Desktop computers

All elements remain centered and visible without requiring scrolling.

---

## Custom Font

The interface uses the **Microsport** font.

Place the font file inside:

```text
public/fonts/Microsport.ttf
```

---

## Future Improvements

Some features planned for future versions include:

- Real-time updates using Socket.io
- Admin authentication system
- Multiple countdown events
- Dark mode support
- Sound notifications when the timer ends
- Progressive Web App (PWA) support
- Offline functionality
- Improved circular progress animations

---

## About This Project

This project was developed as a personal project with the goal of creating a simple and visually appealing examination countdown system for A/L students. The design focuses on clarity, motivation, and ease of use while maintaining accurate synchronization across all users.

---

## Author

**Gayantha Hashan**

Health Information and Communication Technology Undergraduate

Sri Lanka

---

## License

This project is released under the MIT License and may be freely modified and distributed.
