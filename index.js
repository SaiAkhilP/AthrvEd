const express = require('express');
const bodyParser = require('body-parser')

var app = express();

// app.use(express.json());
// const Sequelize = require('sequelize');
const port = 3000;
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

app.post("/createEvent", (req, res) => {
    const texts = req.body.texts;
    console.log(texts);
    // res.send("Check console.")
})

app.listen(port, () => console.log(`App listening on port ${port}!`))