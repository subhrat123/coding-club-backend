// 📁 server/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

//  Load environment variables
dotenv.config();

//  Set up __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  App setup
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => {
    console.error("🔴 MongoDB Connection Error:", err.message);
    process.exit(1);
  });

//  Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

//  Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  imgSrc: { type: String, required: true },
});
const EventModel = mongoose.model("events_collections", eventSchema);

// Cloudinary Upload Function
const uploadToCloudinary = async (filePath, publicId) => {
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    folder: "events_images",
  });
  return result;
};

//ROUTES

//  GET all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await EventModel.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error(" Fetching Events Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  POST new event
app.post("/api/events", async (req, res) => {
  try {
    const { title, date, description } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image file is required" });
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
    res
      .status(201)
      .json({ message: " Event created successfully!", event: newEvent });
  } catch (error) {
    console.error(" Event Creation Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  PUT update event by ID
app.put("/api/events/:id", async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const updatedData = { title, date, description };

    if (req.files?.image) {
      const result = await uploadToCloudinary(
        req.files.image.tempFilePath,
        `event_${Date.now()}`
      );
      updatedData.imgSrc = result.secure_url;
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: " Event not found!" });
    }

    res
      .status(200)
      .json({ message: " Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.error(" Update Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE event by ID
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deleted = await EventModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: " Event not found!" });
    }

    res.status(200).json({ message: " Event deleted successfully!" });
  } catch (error) {
    console.error(" Delete Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Start Server
app.listen(PORT, () => {
  console.log(`🌍 Server live at http://localhost:${PORT}`);
});
