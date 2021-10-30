const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 7000;

// user=hotel_booking
// password=fpPMqSs29RorzT63
app.use(cors())
app.use(express.json())

// connect with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aghhg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('hotelMotel')
        const offerCollection = database.collection('offers')
        app.get('/services', async (req, res) => {
            const cursor = offerCollection.find({})
            const result = await cursor.toArray();
            res.json(result)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await offerCollection.findOne(query)
            res.json(result)
        })
        app.post('/service', async (req, res) => {
            const offer = req.body;
            // console.log("hit the post api-1")
            res.send('post hitted.')
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

async function start() {
    try {
        await client.connect();
        const database = client.db('storage')
        const storedOffers = database.collection('offers')
        console.log('storage db connected.')

        // store a offer
        app.post('/store', async (req, res) => {
            const offer = req.body;
            console.log("hit the post api")
            console.log('stored item', offer)
            const result = await storedOffers.insertOne(offer)
            res.json(result)
        })
        app.post('/store/:email', async (req, res) => {
            const email = req.params.email
            console.log('store/email hitted.', email)
            const query =  storedOffers.find()
            console.log('this is query', query)
            res.send('get email')
        })

    }
    finally {
        //   await client.close();
    }
}
start().catch(console.dir)

app.get('/', (req, res) => {
    res.send('server is running.')
})
app.listen(port, () => {
    console.log('this server is running at the port', port)
})