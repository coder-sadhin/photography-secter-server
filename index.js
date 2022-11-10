const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());

// jwt token verify function 

function JwtTokenVerify(req, res, next) {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
        res.status(401).send({ message: 'unauthorize access' })
    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, process.env.JWT_TOKEN_SECRET_CODE, function (err, decoded) {
        if (err) {
            res.status(401).send({ message: 'unauthorize access' })
        }
        req.decoded = decoded;
        next()
    });
}

// database connection 
const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.bbbtstv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        // all data collections 
        const serviceCollection = client.db('photography_database_collection').collection('services');
        const blogsCollection = client.db('photography_database_collection').collection('blogs');
        const reviewCollection = client.db('photography_database_collection').collection('review-collection');
        const productCollection = client.db('photography_database_collection').collection('productCollection');

        //   all service api       
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })

        app.get('/home/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.limit(3).toArray();
            res.send(service);
        })
        // add a service api 
        app.post('/addService', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })
        // blogs api 
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })

        // service details api 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // spacifice service review api 

        app.get('/service/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service_id: id };
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
            // console.log(reviews)
        })

        // add review api 
        app.post('/addReview', async (req, res) => {
            const review = req.body;
            // console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        // review api 
        app.get('/myReview', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query);
            res.send(result);
            // console.log(id)
        })

        // review update api 
        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const massage = req.body.massage;
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    massage: massage
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
            // console.log(massage);
        })

        // work sample api 
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })


        // jwt token set api

        app.post('/user/jwt', (req, res) => {
            const user = (req.body)
            const token = jwt.sign(user, process.env.JWT_TOKEN_SECRET_CODE)
            res.send({ token })
            // console.log(user)
        })



    }
    finally {

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.json('server is running')
})

app.listen(port, () => {
    console.log('server is running')
})