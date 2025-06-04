require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB cluster
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Create a schema and model
const ItemSchema = new mongoose.Schema({
  title: String,
  text: String,
  name: String,
  image: String,
});

const Item = mongoose.model("Item", ItemSchema, "teams_collection");



// Route to insert JSON data
app.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error saving item:", err);
    res.status(500).send(err.message);
  }
});

// Route to fetch all items
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.listen(5000, () => console.log("Server running on port 5000"));
