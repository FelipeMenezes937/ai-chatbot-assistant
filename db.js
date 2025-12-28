const { MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017"
const dbName = "myDatabase"

async function getDb(){
    const client = new MongoClient(uri, {useUnifiedTopology: true});
    await client.connect();
    return client.db(dbName);

}

module.exports = getDb;