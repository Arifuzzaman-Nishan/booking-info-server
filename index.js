const express = require('express')
const app = express()
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID
require('dotenv').config()

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e7kuf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const bookingCollection = client.db("bookingInfo").collection("information");

    //   insert into database
    app.post('/addInformation', (req, res) => {
        const newInfo = req.body;
        bookingCollection.insertOne(newInfo)
            .then(result => {
                console.log("inserted count", result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    //   read data from database
    app.get('/showAllInfo', (req, res) => {
        bookingCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })


    // update
    app.patch('/update/:id', (req, res) => {
        bookingCollection.updateOne({ _id: ObjectID(req.params.id) }, {
            $set: {
                name: req.body.name,
                id: req.body.id,
                email: req.body.email,
                mobile: req.body.mobile,
                district: req.body.district
            }
        })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    // delete
    app.delete('/delete/:id',(req,res) => {
        bookingCollection.deleteOne({_id: ObjectID(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })

    // search
    app.get('/search',(req,res) => {
        console.log(req.query.name);
        bookingCollection.find({name:req.query.name})
        .toArray((err,documents) => {
            res.send(documents[0]);
        })
    })

});





app.listen(port)