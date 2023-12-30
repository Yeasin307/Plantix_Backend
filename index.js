const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "plantix",
    multipleStatements: true
});

app.get('/', (req, res) => {
    res.send('Welcome To Plantix.')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})