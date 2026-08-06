const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express()
const uri = process.env.MONGODB_URL;
const port = process.env.PORT || 5000;
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello User In Torlet Server !')
})

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



const DBName = client.db("TorletDatabase");
const ProductCollection = DBName.collection("ProductsCollection")

// Get Product Data
app.get('/api/product', async (req, res) => {
    const cursor = ProductCollection.find();
    const result = await cursor.toArray()
    res.send(result)
})


// Product Post Api 
app.post('/api/Products', async (req, res) => {
    const Data = req.body
    const NewData = { ...Data, createdAt: new Date() }
    const result = await ProductCollection.insertOne(NewData)

    res.send(result)
})



app.get('/', (req, res) => {
    res.send('Hello World!')
})


async function run() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

run();


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})