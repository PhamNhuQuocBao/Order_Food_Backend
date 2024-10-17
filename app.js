// app.js
import { Restaurant } from "./models/retaurant.model.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./models/user.model.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string from the .env file
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route
// =====================   User  ========================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    if (user) {
      res.status(200).json(user);
      return;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =====================RESTAURANT========================
app.get("/restaurants", async (req, res) => {
  try {
    const restaurant = await Restaurant.find();

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/restaurants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id);

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/restaurants", async (req, res) => {
  try {
    const restaurantModel = new Restaurant(req.body);
    const restaurant = await restaurantModel.save();

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/restaurants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await Restaurant.findByIdAndUpdate(id, req.body);

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/restaurants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await Restaurant.findByIdAndDelete(id);

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
