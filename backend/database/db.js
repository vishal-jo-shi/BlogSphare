const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI
const options = {
    serverSelectionTimeoutMS: 30000 // Set timeout to 30 seconds (30000 milliseconds)
};
 let client ,clientPromise

 if(!process.env.MONGODB_URI){
    throw new Error('Please add you Mongo URI to .env')
 }

 if(process.env.NODE_ENV==='development'){
        if(!global._mongoClientPromise){
            client = new MongoClient(uri,options)
            global._mongoClientPromise = client.connect()
        }
        clientPromise=global._mongoClientPromise
 }else{
    client = new MongoClient(uri,options)
    clientPromise = client.connect()
 }
 console.log("just connected")

 module.exports= clientPromise
