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
        const categories = await Categories.findAll({
            order: [
                ['position', 'ASC'],
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
                }
            ]
        });

        if (!categories) {
            res.status(400).json({ error: "Bad Request!" });
        }
        else {
            res.status(200).send(categories);
        }
    }
    catch (error) {
        res.status(401).json({ error: "error" });
    }
});

router.post("/category-details", verifyToken, async (req, res) => {
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
        let { name, description, parentId, position, userId } = req.body;

        if (parentId == '') {
            parentId = null
        }

        if (position == '') {
            position = 99999
        }

        const category = await Categories.create({ name, description, parentId, image: req.file.filename, position, createdBy: userId, updatedBy: userId });

        if (!category) {
            res.status(400).json({ error: "Bad Request!" });
        }
        else {
            res.status(200).send("Created Category Successfully!");
        }

    }
    catch (error) {
        res.status(401).json({ error: "error" });
    }
});

module.exports = router;