const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root',
    database: 'hotel_management'
});

db.connect(err => {
    if (err) {
        console.log('Database connection failed');
    } else {
        console.log('Connected to MySQL');
    }
});

app.post('/addCustomer', (req, res) => {
    const { name, phone, email } = req.body;
    const sql = 'INSERT INTO Customers (name, phone, email) VALUES (?, ?, ?)';
    db.query(sql, [name, phone, email], (err, result) => {
        if (err) return res.send(err);
        res.send('Customer Added');
    });
});

app.get('/customers', (req, res) => {
    db.query('SELECT * FROM Customers', (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
app.post('/bookRoom', (req, res) => {
    const { customer_id, room_id, check_in, check_out } = req.body;

    const sql = 'INSERT INTO Bookings (customer_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [customer_id, room_id, check_in, check_out], (err, result) => {
        if (err) return res.send(err);

        db.query("UPDATE Rooms SET status='Booked' WHERE room_id=?", [room_id]);

        res.send('Room Booked Successfully');
    });
});

app.get('/bookings', (req, res) => {
    const sql = `
    SELECT b.booking_id, c.name, r.room_type, b.check_in, b.check_out
    FROM Bookings b
    JOIN Customers c ON b.customer_id = c.customer_id
    JOIN Rooms r ON b.room_id = r.room_id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

app.get('/rooms', (req, res) => {
    db.query("SELECT * FROM Rooms", (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});
app.get('/customers-simple', (req, res) => {
    db.query("SELECT customer_id, name FROM Customers", (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});