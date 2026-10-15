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

// GET ROOMS API
app.get('/studynook', async (req, res) => {
    const data = await studentColl.find()
    const result = await data.toArray()
    res.send(result);
})

// GET ONE ROOMS API
app.get(`/studynook/:id`, async (req, res) => {
    const { id } = req.params;
    const data = await studentColl.findOne({
        _id : new ObjectId(id)
    })
    const result = await data;
    res.send(result)
})

// POST ONE DATA API
app.post('/sturdynook', async(req, res)=>{
    const data = req.body;
    const postData = await studentColl.insertOne(data);
    res.send(postData);
})

// DELETE API
app.delete('/sturdynook/:id', async (req, res) => {
    const {id} = req.params;
      const data = await studentColl.findOne({
        _id : new ObjectId(id)
    })
    const result = await studentColl.deleteOne(data);
    res.send(result);
})

// UPDATE API


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})