const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://todo:todo@todo.p4vcr.mongodb.net/test";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    await client.close();
  }
}

main();