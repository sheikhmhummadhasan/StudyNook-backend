// https://github.com/sheikhmhummadhasan/StudyNook-backend

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const db = client.db('sturdynook');
const studentColl = db.collection('rooms');
// const bookingColl = db.collection('booking')

const run = async () => {
    try {
        // TODO:when backend is deployment this line going to commet
        await client.connect();
        // TODO:when backend is deployment this line going to commet
        await client.db('admin').command({ ping: 1 })
        console.log("Pinged your deployment!!!!");
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dre);

app.get('/studynook', async (req, res) => {
    const data = await studentColl.find().limite(5)
    const result = await data.toArray()
    res.send(result)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})