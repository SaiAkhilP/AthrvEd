const express = require('express');
const bodyParser = require('body-parser')

var app = express();

// app.use(express.json());
// const Sequelize = require('sequelize');
const port = 3001;
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)
app.use(bodyParser.json())


const { Client } = require('pg');
const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
});

db.connect((err) => {
    if (err) {
        return console.error("error: " + err.message);
    } else {
        console.log("Connected to PostgreSQL.");

        const eventQuery = `CREATE TABLE IF NOT EXISTS events ( name varchar(50), date varchar(50) )`;
        db.query(eventQuery, (err, res) => {
            if (err) { console.log("ERROR : ", err) }
        })

        const userQuery = `CREATE TABLE IF NOT EXISTS users ( name varchar(50) NOT NULL, age int NOT NULL, phone int, email varchar(50), address varchar );`;
        db.query(userQuery, (err, res) => {
            if (err) { console.log("ERROR : ", err) }
        })

    }
});


app.get('/', (req, res) => res.json({ message: 'Hello World' }))

app.post("/createEvent", async (req, res) => {
    console.log(req.body)
    let name = req.body.name, date = req.body.date;
    const update = await db.query(`INSERT INTO events(name, date) VALUES($1, $2) RETURNING * `, [name, date], (err, response) => {
        if (err) { res.send("Error adding data.") }
        else { res.send("Added Event and Date") }
    })
})


app.post("/createUser", async (req, res) => {
    // console.log(req.body)
    let name = req.body.name, age = req.body.age, phone = req.body.phone, email = req.body.email, address = req.body.address;
    const update = await db.query(`INSERT INTO users VALUES($1, $2, $3, $4, $5)`, [name, age, phone, email, address], (err, response) => {
        if (err) { res.send("Error adding data."); console.log(err) }
        else { res.send("User Registered") }
    })
})

app.get("/getEvents", (req, res) => {
    db.query("SELECT * FROM events", (err, response) => {
        if (response) { res.send(response.rows) }
        else { res.send(err) }
    })
})





fetch('/createEvent', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },

});

app.listen(port, () => console.log(`App listening on port ${port}!`))