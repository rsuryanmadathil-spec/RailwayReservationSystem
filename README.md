# Railway Ticket Reservation System

## About the Project

The Railway Ticket Reservation System is a web-based application developed using HTML, CSS, and JavaScript. It provides a simple interface for booking tickets, cancelling reservations, searching passenger details, and managing confirmed passengers and waiting lists.

The project demonstrates the application of fundamental data structures in a railway reservation scenario.

## Features

- Book tickets by entering passenger details.
- Cancel confirmed and waiting-list tickets.
- View confirmed passengers and waiting-list details.
- Search tickets using a unique ticket ID.
- Automatically promote waiting-list passengers when confirmed tickets are cancelled.
- View recently cancelled tickets.
- Monitor reservation statistics through a dashboard.
- Store reservation data using browser Local Storage.
- Responsive interface for desktop and mobile devices.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser Local Storage

## Data Structures

| Data Structure | Purpose |
|---|---|
| Array | Stores and manages passenger records |
| Queue (FIFO) | Manages waiting-list passengers |
| Stack (LIFO) | Organizes recently cancelled tickets |

## Project Structure

```text
Railway-Reservation-System/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Make sure all three source files are in the same folder.
4. Open `index.html` in a web browser or run it using the Live Server extension.
5. Use the interface to book, search, and cancel tickets.

## Default Capacity

- Confirmed passengers: 3
- Waiting-list passengers: 5

These values can be changed in `script.js`.

## Learning Outcomes

- Understanding basic data structures and their applications.
- Implementing FIFO queue operations for waiting-list management.
- Applying LIFO principles to cancellation history.
- Developing interactive web pages using JavaScript.
- Managing browser data using Local Storage.
- Creating responsive user interfaces with HTML and CSS.

## Limitations

This project is an educational simulation. It does not connect to a real railway reservation database or provide live train schedules, online payments, or actual railway ticket bookings. Data is stored locally in the browser.

## Future Improvements

- Integrate a backend and database.
- Add user authentication.
- Include train schedules and journey dates.
- Implement seat selection and ticket generation.
- Add booking confirmation and printable tickets.

## License

This project is available for educational and learning purposes.
