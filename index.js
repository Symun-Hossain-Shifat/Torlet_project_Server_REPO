const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const uri = process.env.MONGODB_URL;
const port = process.env.PORT;

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello User In Torlet Server!");
});

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const DBName = client.db("TorletDatabase");
const ProductCollection = DBName.collection("ProductsCollection");
const CartCollection = DBName.collection("CartCollection");

// Get Product Data
app.get("/api/Product", async (req, res) => {
    const { id } = req.query;
    let query = {}
    if (id) {
        query = { _id: new ObjectId(id) }
    }
    try {
        const result = await ProductCollection.find(query).toArray();
        res.status(200).send(result);
    } catch (error) {
        console.error("GET PRODUCT ERROR:", error);
        res.status(500).send({
            message: "Failed to get products",
            error: error.message,
        });
    }
});

// Product Post API
app.post("/api/Product", async (req, res) => {
    try {
        const Data = req.body;

        const NewData = {
            ...Data,
            createdAt: new Date(),
        };

        const result = await ProductCollection.insertOne(NewData);

        res.status(201).send(result);
    } catch (error) {
        console.error("POST PRODUCT ERROR:", error);

        res.status(500).send({
            message: "Failed to add product",
            error: error.message,
        });
    }
});

// Cart Post API
app.post("/api/Cart", async (req, res) => {
    try {
        const Data = req.body;

        const NewData = {
            ...Data,
            createdAt: new Date(),
        };

        const result = await CartCollection.insertOne(NewData);

        res.status(201).send(result);
    } catch (error) {
        console.error("POST CART ERROR:", error);

        res.status(500).send({
            message: "Failed to add cart",
            error: error.message,
        });
    }
});

async function run() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
}

run();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})