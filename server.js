//Import express module
const express = require("express");

//import the mongoclient
const { MongoClient } = require("mongodb");

//import the cors
const cors = require("cors");

// Import the dotenv package
require('dotenv').config();

//Create a REST Object using express()
const app = express();

//Middleware to parse JSON data in the request body
app.use(express.json());

//use the cors to enable cors policy
app.use(cors());

//Get the PORT and MONGO_URI from .env file
let port = process.env.PORT;
let mongoUri = process.env.MONGO_URI;

//Create a GET REST Request for this app
app.get("/",async (req,res)=>{
    //connect with mongodb by mongoclient constructor
    const clientObj = new MongoClient(mongoUri);

    try{
        //Get the Database reference
        let db = clientObj.db("node_versel");

        //Perform find() operation and get results
        const animes = await db.collection("animes").find({}).toArray();

        //validate
        if(animes.length > 0){
            res.status(200).json(animes);
        }else{
            res.status(404).json({"Message":"Fetching failed!!!"});
        }
    }catch(err){
        res.status(500).json({"Message":"Error in Connection... failed!!!"});
    }
    finally{
        clientObj.close();
    }
});

//Create a POST mode insert request or REST Service, in the anime databse
app.post("/insert",async (req,res)=>{
    //connect with mongodb by mongoclient constructor
    const clientObj = new MongoClient(mongoUri);

    try{
        //Get the database reference
        let db = clientObj.db("node_versel");

        //Perform the inserOne operation in the database collection
        const result = await db.collection("animes").insertOne({
            "id": req.body.id,
            "title": req.body.title,
            "protagonist": req.body.protagonist,
            "price": req.body.price,
            "author": req.body.author,
            "image": req.body.image
        });

        //validate this result
        if(result.insertedId){
            res.status(500).json(result);
        }else{
            res.status(404).json({"msg":"Insertion Failed...."});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({"msg":"Error in connection!!!"});
    }
    finally{
        clientObj.close();
    }
})


//Make the server starting and listening
app.listen(port,()=>{
    console.log(`Server started at Some given port number of - ${port}`);
});