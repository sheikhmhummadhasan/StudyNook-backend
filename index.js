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
const bookingColl = db.collection('booking')
const listingColl = db.collection('my-listing')

const { jwtVerify, createRemoteJWKSet } = require('jose-cjs');

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.LOCAL_URL}/api/auth/jwks`)
);

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



const verifyToken = async (req, res, next) => {
    const header = req?.headers.authorization;
    
    if (!header) {
        return res.status(401).json({ message: 'unaythorized missing token' })
    }

    const token = header.split(" ")[1]
    
    if (!token) {
        return res.status(401).json({ message: 'unaythorized invalid token' })
    }
    
    const { payload } = await jwtVerify(token, JWKS);
    next();

}

// MY LISTENING API

app.get("/my-listings/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const result = await studentColl.find({ createdBY: userId }).toArray();
  res.send(result);
});

// MY BOOKINGS API
app.get("/mybooking/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await bookingColl.find({ bookedBY: userId }).toArray();
  res.send(result);
});



// GET ROOMS API
app.get('/studynook', async (req, res) => {
    const data = await studentColl.find()
    const result = await data.toArray()
    res.send(result);
})

// GET ONE ROOMS API
app.get(`/studynook/:id`,verifyToken, async (req, res) => {
    const { id } = req.params;
    const result = await studentColl.findOne({
        _id : new ObjectId(id)
    })
    res.send(result)
})

// POST ONE DATA API
app.post('/studynook',verifyToken, async(req, res)=>{
    const data = req.body;
    const postData = await studentColl.insertOne(data);
    res.send(postData);
})

// DELETE API
app.delete('/studynook/:id',verifyToken, async (req, res) => {
    const {id} = req.params;
      const data = await studentColl.findOne({
        _id : new ObjectId(id)
    })
    const result = await studentColl.deleteOne(data);
    res.send(result);
})

// UPDATE API
app.patch('/studynook/:id',verifyToken, async(req, res)=>{
    const {id} = req.params;
    const filter = {
        _id : new ObjectId(id),
    };
    const modFilter = req.body;
    const updateDoc = {
        $set:modFilter
    };
    const result = await studentColl.updateOne(filter, updateDoc);
    res.send(result);
})

// BOOKING POST API
app.post('/booking', verifyToken, async(req, res) => {
    const data = await req.body;
    const result = await bookingColl.insertOne(data)
    res.send(result);
})

// GET BOOKING DATA API
app.get('/booking', async(req, res) => {
    const data = await bookingColl.find().toArray();
    res.send(data)
})

// DELETE BOOKING DATA API
app.delete('/booking/:id', verifyToken, async (req, res) => {
    const {id} = req.params;
    const quire = await bookingColl.findOne(
        {
            _id : new ObjectId(id)
        }
    )
    const result = await bookingColl.deleteOne(quire);
    res.send(result)
})

// BOOKING CANCEL / UPDATE DATA API
app.patch('/mybooking/:id', verifyToken, async(req, res) => {
    const {id} = req.params;
    const filter = {
        _id : new ObjectId(id)
    }
    const modFilter = {
        $set : {
            status : 'Cancelled'
        }
    }
    const result = await bookingColl.updateOne(filter, modFilter);
    res.send(result);
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})