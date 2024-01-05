const express = require("express");
const cors = require("cors");
require('dotenv').config();
const multer = require('multer');
const db = require("./models");
const authRouter = require("./routes/Authentication");
const postsRouter = require("./routes/Posts");

db.sequelize.sync()
    .then(() => {
        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/static', express.static('uploads'));
        app.set('view engine', 'ejs');

        app.use("/auth", authRouter);
        app.use("/posts", postsRouter);

        app.use((err, req, res, next) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    res.status(500).send("There was an upload error!");
                } else {
                    res.status(500).send(err.message);
                }
            } else {
                res.send("success");
            }
        });

        app.get('/', (req, res) => {
            res.send('Welcome to Plantix.');
        })

        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((error) => {
        console.log(`error: ${error.message}`);
    });
