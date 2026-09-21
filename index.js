const express = require("express");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

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


const transforter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASS
    }
})

// Send Welcome Mail After Completing Sign In
app.post('/api/auth/signup', async (req, res) => {
    const { email, name } = req.query;

    const mailOptions = {
        from: `"Torlet" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Torlet 🎉',
        text: `Welcome to Torlet, ${name}! We are happy to have you with us. Start exploring at https://torlet.com`,
        html: `
    <div style="background-color: #0a0a0a; padding: 40px 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 520px; margin: 0 auto; background-color: #111111; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background-color: #000000; padding: 28px 32px; text-align: center; border-bottom: 2px solid #d4af37;">
                <h1 style="margin: 0; color: #d4af37; font-size: 26px; letter-spacing: 1px;">TORLET</h1>
            </div>

            <!-- Body -->
            <div style="padding: 32px;">
                <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Welcome, ${name}! 🎉</h2>
                <p style="color: #b3b3b3; font-size: 15px; line-height: 1.7;">
                    Thanks for joining Torlet. Your account has been created successfully, and we're excited 
                    to have you as part of our community.
                </p>
                <p style="color: #b3b3b3; font-size: 15px; line-height: 1.7;">
                    You can now browse products, manage your orders, and enjoy a shopping experience built 
                    just for you. If you ever have questions, our support team is only an email away.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 32px 0;">
                    <a href="https://torlet-project-client-side.vercel.app/" 
                       style="background-color: #d4af37; color: #000000; text-decoration: none; 
                              padding: 14px 32px; border-radius: 6px; font-weight: bold; 
                              font-size: 15px; display: inline-block;">
                        Start Exploring
                    </a>
                </div>

                <p style="color: #666666; font-size: 13px; line-height: 1.6;">
                    If you didn't sign up for this account, you can safely ignore this email.
                </p>
            </div>

            <!-- Social Footer -->
            <div style="background-color: #000000; padding: 24px 32px; text-align: center; border-top: 1px solid #2a2a2a;">
                <p style="color: #888888; font-size: 13px; margin-bottom: 16px;">Follow us</p>
                <div>
                    <a href="https://www.instagram.com/torle.tcom?stkn=MTFzNTd6ZXpoaGpyNg%3D%3D&utm_source=qr" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                        <span style="display: inline-block; width: 36px; height: 36px; line-height: 36px; background-color: #1a1a1a; border-radius: 50%; color: #d4af37; font-size: 15px;">IG</span>
                    </a>
                    <a href="https://www.facebook.com/torlet.page?mibextid=wwXIfr&rdid=eOFlfvoCj7XQMTnZ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19FinNjZBp%2F%3Fmibextid%3DwwXIfr" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                        <span style="display: inline-block; width: 36px; height: 36px; line-height: 36px; background-color: #1a1a1a; border-radius: 50%; color: #d4af37; font-size: 15px;">FB</span>
                    </a>
                    <a href="https://x.com/mdmozhar?s=11" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                        <span style="display: inline-block; width: 36px; height: 36px; line-height: 36px; background-color: #1a1a1a; border-radius: 50%; color: #d4af37; font-size: 15px;">X</span>
                    </a>
                    <a href="https://linkedin.com" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                        <span style="display: inline-block; width: 36px; height: 36px; line-height: 36px; background-color: #1a1a1a; border-radius: 50%; color: #d4af37; font-size: 15px;">in</span>
                    </a>
                </div>
                <p style="color: #555555; font-size: 12px; margin-top: 20px;">© ${new Date().getFullYear()} Torlet. All rights reserved.</p>
            </div>
        </div>
    </div>
    `
    };
    transforter.sendMail(mailOptions)
})

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
const OrderCollection = DBName.collection('OrderCollection')

// Verify Token 
const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)

// Verify Authentication of Login TOken 
const VerifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const id = req.headers.user

    if (!authHeader) {
        return res.status(401).send({
            message: "Unauthorized access",
        });
    }
    const Token = authHeader.split(' ')[1];
    if (!Token) {
        return res.status(401).send({
            message: "Unauthorized access",
        });
    }
    try {
        const { payload } = await jwtVerify(Token, JWKS)
        console.log(payload)

    } catch (error) {
        return res.status(403).send({ message: 'Forbidden' })
    }


    const UserId = new ObjectId(id)
    const user = await UsersCollection.findOne({ _id: UserId })
    // console.log(user)
    req.user = user

    next();
};


// must call after VerifyToken function 

const VerifyAdmin = async (req, res, next) => {
    const user = req.user
    if (user?.role !== 'Admin') {
        return res.status(403).send({ message: 'forbidden access' })
    }
    // console.log(user) 
    next()
}

// must call after VerifyToken function 

const Verifyuser = async (req, res, next) => {
    const user = req.user
    if (user?.role !== 'User') {
        return res.status(403).send({ message: 'forbidden access' })
    }
    // console.log(user) 
    next()
}



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

app.get('/api/Cart', VerifyToken, Verifyuser, async (req, res) => {
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

app.get('/api/user', VerifyToken, VerifyAdmin, async (req, res) => {
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

app.get('/api/wishlist', VerifyToken, Verifyuser, async (req, res) => {
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


app.get('/api/contactinfo', VerifyToken, VerifyAdmin, async (req, res) => {

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


app.get('/api/Order', VerifyToken, async (req, res) => {
    const { email } = req.query;

    let query = {};

    // email থাকলে শুধু ওই email-এর order
    if (email) {
        query = { email };
    }

    try {
        const result = await OrderCollection.find(query).toArray();

        res.status(200).send(result);
    } catch (error) {
        console.error("GET ORDERS ERROR:", error);

        res.status(500).send({
            message: "Failed to get orders",
            error: error.message,
        });
    }
});














// Dlete Data Api 
app.delete('/api/Cart/:id', VerifyToken, Verifyuser, async (req, res) => {
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

app.delete('/api/Order/:id', VerifyToken, VerifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const query = { _id: new ObjectId(id) }
        const result = await OrderCollection.deleteOne(query);
        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Order not found",
            });
        }
        res.status(200).send(result);
    } catch (error) {
        console.error("DELETE ORDER ERROR:", error);
        res.status(500).send({
            message: "Failed to delete order",
            error: error.message,
        });
    }
})


app.delete('/api/wishlist/:id', VerifyToken, Verifyuser, async (req, res) => {
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


app.delete('/api/contactinfo/:id', VerifyToken, VerifyAdmin, async (req, res) => {
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

app.delete('/api/Product/:id', VerifyToken, VerifyAdmin, async (req, res) => {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) }
    try {
        const result = await ProductCollection.deleteOne(query);
        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Product not found",
            });
        }
        res.status(200).send(result);
    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);
        res.status(500).send({
            message: "Failed to delete product",
            error: error.message,
        });
    }
})





// Update APi  
app.patch('/api/user/:email', VerifyToken, VerifyAdmin, async (req, res) => {
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

app.patch('/api/Order/:id', VerifyToken, VerifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body

    const result = await OrderCollection.updateOne({ _id: new ObjectId(id) }, { $set: { status: status } });
    if (result.modifiedCount === 0) {
        return res.status(404).send({
            message: "Order not found",
        });
    }
    res.status(200).send(result);
})




// Product Post API
app.post("/api/Product", VerifyToken, VerifyAdmin, async (req, res) => {
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
app.post("/api/Cart", VerifyToken, Verifyuser, async (req, res) => {
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
app.post('/api/contactinfo', VerifyToken, Verifyuser, async (req, res) => {
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
app.post('/api/wishlist', VerifyToken, Verifyuser, async (req, res) => {
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


app.post('/api/Order', VerifyToken, Verifyuser, async (req, res) => {
    const data = req.body;
    const newData = { ...data, CreatedAt: new Date() }

    try {
        const result = await OrderCollection.insertOne(newData)
        res.status(201).send(result)
    } catch (error) {


        res.status(500).send({
            success: false,
            message: "Failed to add order",
            error: error.message,
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