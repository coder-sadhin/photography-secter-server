const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.bbbtstv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        const serviceCollection = client.db('photography_database_collection').collection('services');
        const blogsCollection = client.db('photography_database_collection').collection('blogs');
        const reviewCollection = client.db('photography_database_collection').collection('review-collection');
        const productCollection = client.db('photography_database_collection').collection('productCollection');

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

        app.post('/addService', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.get('/service/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service_id: id };
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
            // console.log(reviews)
        })

        app.post('/addReview', async (req, res) => {
            const review = req.body;
            // console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

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


        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
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