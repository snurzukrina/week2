const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const drivers = [
  { name: "John Doe", rating: 4.6, available: true },
  { name: "Jane Smith", rating: 4.4, available: false },
  { name: "Alice Johnson", rating: 4.8, available: true },
  { name: "Bob Brown", rating: 4.2, available: true },
  { name: "Charlie Green", rating: 4.7, available: false }
];

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("testDB");
    const driverCollection = db.collection("drivers");

    // **Step 1: Clear Existing Data & Insert Fresh Data**
    await driverCollection.deleteMany({});
    await driverCollection.insertMany(drivers);
    console.log("Inserted drivers into MongoDB");

    // **Step 2: Display All Drivers Before Deletion**
    console.log("All drivers before deletion:");
    console.log(await driverCollection.find().toArray());

    // **Step 3: Delete All Unavailable Drivers**
    const deleteResult = await driverCollection.deleteMany({ available: false });
    console.log(`Deleted ${deleteResult.deletedCount} unavailable drivers.`);

    // **Step 4: Display Remaining Drivers**
    console.log("All drivers after deletion:");
    console.log(await driverCollection.find().toArray());

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();