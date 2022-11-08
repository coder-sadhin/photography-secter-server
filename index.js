const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



/// user :photography_user
/// password: 7xzReybfRLfc9kvz
/// photography_database_collection




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://photography_user:7xzReybfRLfc9kvz@cluster0.bbbtstv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });








// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const run = async () => {
    try {
        const serviceCollection = client.db('photography_database_collection').collection('services');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })








    }
    finally {

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('server is running')
})