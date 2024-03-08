//Import express module
const express = require("express");

//import the mongoclient
const { MongoClient } = require("mongodb");

// Import the dotenv package
require('dotenv').config();

//Create a REST Object using express()
const app = express();

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

//Make the server starting and listening
app.listen(port,()=>{
    console.log(`Server started at Some port number of ${port}`);
});