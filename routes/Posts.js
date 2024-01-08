const express = require("express");
const multer = require('multer');
const sharp = require('sharp');
const path = require("path");
const router = express.Router();
const { Users, Posts } = require("../models");
const { verifyToken } = require("../middlewares/Auth");
const { where } = require("sequelize");

const IMAGES_UPLOADS = "./uploads";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_UPLOADS);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);

        const fileName = file.originalname
            .replace(fileExt, "")
            .toLowerCase()
            .split(" ")
            .join("-") + "-" + Date.now();

        cb(null, fileName + fileExt);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/gif" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only .jpg, .jpeg, .png or .gif format allowed!"));
        }
    },
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const posts = await Posts.findAll({
            include: [
                {
                    as: 'createdByUser',
                    model: Users
                },
                {
                    as: 'updatedByUser',
                    model: Users
                }
            ]
        });

        if (!posts) {
            res.status(400).json({ error: "Bad Request!" });
        }
        else {
            res.status(200).send(posts);
        }
    }
    catch (error) {
        res.status(401).json({ error: "error" });
    }
});

router.post("/post-details", verifyToken, async (req, res) => {
    try {
        const { id } = req.body;
        const category = await Categories.findOne({
            where: {
                id: id
            },
            order: [
                [{ as: 'Child', model: Categories }, 'position', 'ASC']
            ],
            include: [
                {
                    as: 'Parent',
                    model: Categories
                },
                {
                    as: 'Child',
                    model: Categories,
                    where: {
                        active: '1',
                        deleted: '0'
                    },
                    required: false
                },
                {
                    as: 'createdByUser',
                    model: Users
                },
                {
                    as: 'updatedByUser',
                    model: Users
                }
            ]
        });

        if (!category) {
            res.status(400).json({ error: "Bad Request!" });
        }
        else {
            res.status(200).send(category);
        }
    }
    catch (error) {
        res.status(401).json({ error: "error" });
    }
});

router.post("/create", verifyToken, upload.single("image"), async (req, res) => {

    try {
        let { title, description, userId } = req.body;

        const post = await Posts.create({ title, description, image: req.file.filename, createdBy: userId, updatedBy: userId });

        if (!post) {
            res.status(400).json({ error: "Bad Request!" });
        }
        else {
            res.status(200).send("Posted Successfully!");
        }

    }
    catch (error) {
        res.status(401).json({ error: "error" });
    }
});

module.exports = router;