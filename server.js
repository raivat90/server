const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// require("dotenv").config(); // To load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection - Using environment variables for sensitive data
const MONGODB_URI =
  "mongodb+srv://raivat90:NPLQQlHmetNxRnA5@cluster0.fhmnc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Stop the server if we can't connect to MongoDB
  });

// Define your data schema
const dataSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
});

const DataModel = mongoose.model("Data", dataSchema);

// Store Data
app.post("/storeData", async (req, res) => {
  try {
    const newData = new DataModel(req.body); // Create a new document using the model
    await newData.save(); // Save the document to MongoDB
    res.json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data" });
  }
});

// Get All Data (For Admin Panel)
app.get("/getData", async (req, res) => {
  try {
    const storedData = await DataModel.find(); // Retrieve all documents from the collection
    res.json(storedData);
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({ message: "Error getting data" });
  }
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
