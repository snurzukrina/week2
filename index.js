const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const drivers = [
  { name: "John Doe", rating: 4.6, available: true },
  { name: "Jane Smith", rating: 4.4, available: false },
  { name: "Alice Johnson", rating: 4.8, available: true },
  { name: "Bob Brown", rating: 4.2, available: true }
];

// Add a new driver to the array
drivers.push({ name: "Charlie Green", rating: 4.7, available: true });

console.log("Driver Names:");
drivers.forEach(driver => console.log(driver.name));
console.log("Added new driver:", drivers[drivers.length - 1]);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("testDB");
    const driverCollection = db.collection("drivers");

    // Insert all drivers
    await driverCollection.insertMany(drivers);
    console.log("Inserted drivers into MongoDB");

    // Query: Find all high-rated drivers (rating >= 4.5)
    const highRatedDrivers = await driverCollection.find({
      rating: { $gte: 4.5 },
      available: true
    }).toArray();
    console.log("High Rated Available Drivers:", highRatedDrivers);

    // Debug: Show all drivers before update
    console.log("All drivers before update:");
    console.log(await driverCollection.find().toArray());

    // Update: Increase all drivers' ratings by 0.1 where rating >= 4.0
    const updateResult = await driverCollection.updateMany(
      { rating: { $gte: 4.0 } },
      { $inc: { rating: 0.1 } }
    );

    console.log(`Updated ${updateResult.modifiedCount} drivers' ratings by 0.1`);

    // Debug: Show all drivers after update
    console.log("All drivers after update:");
    console.log(await driverCollection.find().toArray());

    // Delete all drivers with rating ≤ 4.2
    const deleteResult = await driverCollection.deleteMany({ rating: { $lte: 4.2 } });
    console.log(`Deleted ${deleteResult.deletedCount} low-rated drivers.`);

    // Debug: Show all drivers after delete
    console.log("All drivers after delete:");
    console.log(await driverCollection.find().toArray());

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();