import express from "express";
// record.js will be for api endpoints
// connect to db
import db from "../db/connection.js";
// convert id from string to ObjectId for _id.
import { ObjectId } from "mongodb";

// create instance of express router
// will be used to define routes
// will be in control of requests starting with path /record
const router = express.Router();

// get list of all records
router.get("/", async (req, res) => {
    let collection = await db.collection("records");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// get single record by id
router.get("/:id", async (req, res) => {
    let collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id) };
    let results = await collection.findOne(query);
    
    if (!result) res.send("Not Found").status(404);
    else res.send(results).status(200);
});

// create new record
router.post("/", async (req, res) => {
    try {
        let newDocument = {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        };
        let collection = await db.collection("records");
        let results = await collection.insertOne(newDocument);
        res.send(results).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record!");
    }
});

// update record by id
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                name: req.body.name,
                position: req.body.position,
                level: req.body.level,
            },
        };

        let collection = await db.collection("records");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating record");
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("records");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});

export default router;