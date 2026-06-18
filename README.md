# AL EXAM TIMER

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

### Student Countdown Interface

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

### Administrator Panel

The administrator page allows users to:

- Select an exam date using a calendar picker
- Set the examination time
- Save the countdown target
- Instantly update the timer shown to all users

---

### Database Integration

MongoDB is used to store the exam date and time. This ensures that:

- The countdown remains accurate after page refreshes.
- Every student sees the same remaining time.
- Users joining later still receive the correct countdown.
- The timer is not dependent on when the page was opened.

---

## Technologies Used

This project was developed using:

### Frontend and Backend
- HTML5
- CSS3
- JavaScript

## Folder Structure

```text

Files:
countdown.html / countdown.css / countdown.js — the public timer display
admin.html / admin.css / admin.js — the admin panel to set the target date/time
server.js + package.json — tiny Node/Express server with a JSON file as the "database" (timer-data.json), exposing GET/POST /api/timer so both pages stay in sync no matter who's watching
A README.md explaining how to run it

```

---

## Key logic decisions:

Server stores the target end datetime (absolute timestamp), not a duration — so countdown is always correct regardless of when a viewer loads the page, page refreshes, etc.
Server also stores the original total duration (computed at the moment admin sets it) so the circle's progress fill can be calculated as % elapsed.
Countdown page polls the server every few seconds for updates (so if admin changes the timer mid-countdown, viewers update) and recalculates remaining time client-side every second using Date.now() vs stored target.
Circle uses an SVG stroke-dasharray approach for the progress ring, with color interpolated between #688CD9 and #8E0204 based on % elapsed.
Text color (the digits) also interpolates from #46169A/#6317E5 toward #8E0204.
Auto-hide year/month/day if they're zero, re-center remaining units, and bump font size to match the "row 1" sizing when that row is empty and only hours/min/sec remain.
Motivational sentence rotates every 60 seconds from a fixed array.

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
**Author - Lahiru Lakshan**
**Contributor - Gayantha Hashan**

Health Information and Communication Technology Undergraduates

Sri Lanka

---

## License

This project is released under the MIT License and may be freely modified and distributed.
