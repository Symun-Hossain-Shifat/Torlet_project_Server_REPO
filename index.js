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
const UsersCollection = DBName.collection("user");
const WishListCollection = DBName.collection('WishListCollection')
const ContactCollection = DBName.collection('ContactCollection')




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

app.get('/api/Cart', async (req, res) => {
    const { email } = req.query;
    let query = {
        email: email
    }
    try {
        const result = await CartCollection.find(query).toArray();
        res.status(200).send(result);
    } catch (error) {
        console.error("GET CART ERROR:", error);
        res.status(500).send({
            message: "Failed to get carts",
            error: error.message,
        });

    }
})

app.get('/api/user', async (req, res) => {
    try {
        const result = await UsersCollection.find().toArray();
        res.status(200).send(result);
    } catch (error) {
        console.error("GET USER ERROR:", error);
        res.status(500).send({
            message: "Failed to get users",
            error: error.message,
        });
    }
})

app.get('/api/wishlist', async (req, res) => {
    const { email } = req.query;
    let query = {
        email: email
    }
    try {
        const result = await WishListCollection.find(query).toArray();
        res.status(200).send(result)
    } catch (error) {
        console.error("GET WISHLIST ERROR:", error);
        res.status(500).send({
            message: "Failed to get wishlist",
            error: error.message,
        });
    }
})


app.get('/api/contactinfo', async (req, res) => {

    try {
        const result = await ContactCollection.find().toArray();
        res.status(200).send(result)
    } catch (error) {
        console.error("GET CONTACT ERROR:", error);
        res.status(500).send({
            message: "Failed to get contacts",
            error: error.message,
        });
    }
})



// Dlete Data Api 
app.delete('/api/Cart/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = { _id: new ObjectId(id) }
        const result = await CartCollection.deleteOne(query);
        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Cart not found",
            });
        }
        res.status(200).send(result);
    } catch (error) {
        console.error("DELETE CART ERROR:", error);
        res.status(500).send({
            message: "Failed to delete cart",
            error: error.message,
        });
    }
})


app.delete('/api/wishlist/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = { _id: new ObjectId(id) }
        const result = await WishListCollection.deleteOne(query);
        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Wishlist not found",
            });
        }
        res.status(200).send(result);
    } catch (error) {
        console.error("DELETE WISHLIST ERROR:", error);
        res.status(500).send({
            message: "Failed to delete wishlist",
            error: error.message,
        });
    }
})


app.delete('/api/contactinfo/:id', async (req, res) => {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) }
    try {
        const result = await ContactCollection.deleteOne(query);
        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Contact not found",
            });
        }
        res.status(200).send(result);
    } catch (error) {
        console.error("DELETE CONTACT ERROR:", error);
        res.status(500).send({
            message: "Failed to delete contact",
            error: error.message,
        });
    }
})




// Update APi  
app.patch('/api/user/:email', async (req, res) => {
    const { email } = req.params;
    const { isBlocked } = req.body

    const result = await UsersCollection.updateOne({ email: email }, { $set: { isBlocked: isBlocked } });
    if (result.modifiedCount === 0) {
        return res.status(404).send({
            message: "User not found",
        });
    }
    res.status(200).send(result);
})







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

        // Remove product's _id
        const { _id, ...cartData } = Data;

        const NewData = {
            ...cartData,
            productId: _id,
            createdAt: new Date(),
        };

        const result = await CartCollection.insertOne(NewData);

        res.status(201).send({
            success: true,
            message: "Product added to cart successfully",
            result,
        });

    } catch (error) {
        console.error("POST CART ERROR:", error);

        res.status(500).send({
            success: false,
            message: "Failed to add cart",
            error: error.message,
        });
    }
});

// Contact api 
app.post('/api/contactinfo', async (req, res) => {
    const data = req.body
    const NewData = {
        ...data, CreatedAt: new Date()
    }
    try {
        const result = await ContactCollection.insertOne(NewData)
        res.status(201).send(result)
    } catch (error) {
        console.error("POST CONTACT ERROR:", error);

        res.status(500).send({
            success: false,
            message: "Failed to add contact",
            error: error.message,
        });
    }
})


// WishList Post API 
app.post('/api/wishlist', async (req, res) => {
    const data = req.body
    const { _id, ...cartData } = data;

    const NewData = {
        ...cartData,
        productId: _id,
        createdAt: new Date(),
    };
    const result = await WishListCollection.insertOne(NewData)
    if (result.insertedCount > 0) {
        res.status(201).send({
            success: true,
            message: "Product added to wishlist successfully",
            result,
        });
    }
    else {
        res.status(500).send({
            success: false,
            message: "Failed to add product to wishlist",
            error: "Internal Server Error",
        });
    }
})

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