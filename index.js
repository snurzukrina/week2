import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

// ===== TASK 1: Define Drivers Array =====
const drivers = [
  { name: "John Doe", vehicleType: "Sedan", isAvailable: true, rating: 4.8 },
  { name: "Alice Smith", vehicleType: "SUV", isAvailable: false, rating: 4.5 },
  { name: "Bob Johnson", vehicleType: "Truck", isAvailable: true, rating: 4.2 }
];

// ===== TASK 2: JSON Operations =====
// 2.1 Display all driver names
console.log("Driver Names:");
drivers.forEach(driver => console.log(driver.name));

// 2.2 Add new driver
const newDriver = { name: "Charlie Green", vehicleType: "Van", isAvailable: true, rating: 4.7 };
drivers.push(newDriver);
console.log("\nAdded New Driver:", newDriver);

// ===== MongoDB Operations =====
async function main() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("\nConnected to MongoDB!");

    const db = client.db("rideSharingDB");
    const driversCollection = db.collection("drivers");

    // ===== TASK 3: Insert Drivers =====
    await driversCollection.deleteMany({}); // Clear existing data
    const insertResult = await driversCollection.insertMany(drivers);
    console.log(`\nInserted ${insertResult.insertedCount} drivers`);

    // ===== TASK 4: Query Available Drivers =====
    const availableDrivers = await driversCollection.find({
      isAvailable: true,
      rating: { $gte: 4.5 }
    }).toArray();
    console.log("\nAvailable Drivers (rating >= 4.5):", availableDrivers);

    // ===== TASK 5: Update John's Rating =====
    const updateResult = await driversCollection.updateOne(
      { name: "John Doe" },
      { $inc: { rating: 0.1 } }
    );
    console.log(`\nUpdated John Doe's rating. Modified count: ${updateResult.modifiedCount}`);

    // Verify update
    const john = await driversCollection.findOne({ name: "John Doe" });
    console.log("John's new rating:", john.rating.toFixed(1));

    // ===== TASK 6: Delete Unavailable Drivers =====
    const deleteResult = await driversCollection.deleteMany({
      isAvailable: false
    });
    console.log(`\nDeleted ${deleteResult.deletedCount} unavailable drivers`);

    // ===== Final Output =====
    const remainingDrivers = await driversCollection.find().toArray();
    console.log("\nFinal Drivers Collection:");
    console.log(remainingDrivers);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

main();