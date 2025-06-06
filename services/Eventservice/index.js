//index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// 🔧 For __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔌 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => {
    console.error("🔴 Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

//  Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

//  Mongoose Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  imgSrc: { type: String, required: true },
});
const EventModel = mongoose.model("events_collections", eventSchema);

// ☁ Upload to Cloudinary
const uploadToCloudinary = async (filePath, publicId) => {
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
  });
  return result;
};

//  Routes
app.get("/api/events", async (req, res) => {
  try {
    const events = await EventModel.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Fetching Events Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const { title, date, description } = req.body;
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image file uploaded!" });
    }
    const file = req.files.image;
    const result = await uploadToCloudinary(
      file.tempFilePath,
      `event_${Date.now()}`
    );

    const newEvent = new EventModel({
      title,
      date,
      description,
      imgSrc: result.secure_url,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created!", event: newEvent });
  } catch (error) {
    console.error("❌ Event Creation Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, date, description } = req.body;
    let updatedData = { title, date, description };

    if (req.files && req.files.image) {
      const file = req.files.image;
      const result = await uploadToCloudinary(
        file.tempFilePath,
        `event_${Date.now()}`
      );
      updatedData.imgSrc = result.secure_url;
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
      eventId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event updated", event: updatedEvent });
  } catch (error) {
    console.error("❌ Update Event Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await EventModel.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error("❌ Delete Event Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//  Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
