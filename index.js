const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnuoch3.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');


    // database theke sob gulo data eksathe niye api toyri korar code
    // api toyri kore abar client side e dekhano jabe
    // read kora////get
    app.get('/coffee', async(req, res) =>{
     const cursor = coffeeCollection.find();
     const result = await cursor.toArray();
     res.send(result)
    })

    // update korar jonno id dhore ber korar code
    app.get('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })

    // update korar jonno put beboharer code
    app.put('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          quantity:  updatedCoffee.quantity, 
          supplier: updatedCoffee.supplier, 
          taste: updatedCoffee.taste, 
          category: updatedCoffee.category, 
          details: updatedCoffee.details, 
          photo: updatedCoffee.photo
        }
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options)
      res.send(result)
    })

    // data client theke niye asa and backend database e pathanor code 
    // create kora///post
    app.post('/coffee', async(req, res) =>{
      const newCoffe = req.body;
      console.log(newCoffe);
      const result = await coffeeCollection.insertOne(newCoffe);
      res.send(result)
    })

    // specific id dhore delete korar code
    app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Coffe making server is running...');
})

app.listen(port, () => {
    console.log(`Coffe making server port is:${port}`);
})

