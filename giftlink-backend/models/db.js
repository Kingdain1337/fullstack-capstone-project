// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url);      

    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const dbInstance = client.db(dbName);
        console.log(`Connected to database: ${dbName}`);

        return dbInstance;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }

}

module.exports = connectToDatabase;

