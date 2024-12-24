// app.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Restaurant } from "./models/retaurant.model.js";
import { User } from "./models/user.model.js";
import { Menu } from "./models/menu.model.js";
import { Cart } from "./models/cart.model.js";
import Stripe from "stripe";
import { Order } from "./models/order.model.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const stripe = Stripe(process.env.SECRET_KEY_STRIPE); // Replace w

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

app.post("/register", async (req, res) => {
  try {
    const { email } = req.body;

    const hasUser = await User.findOne({ email });

    if (hasUser) {
      res.status(400).json({ message: "user was exist" });
      return;
    }

    const userModel = new User(req.body);
    const user = await userModel.save();

    if (user) {
      res.status(200).json(user);
      return;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/profile", async (req, res) => {
  const { userId, name, phone, address, avatar } = req.body;
  console.log(userId, name, phone, address, avatar);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Find the user by ID and update their profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, avatar, address }, // Fields to update
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(201)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log("Error updating profile:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const profile = await User.findById(id);

    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.log("Error getting profile:", error);
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

app.get("/restaurants-owner/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await Restaurant.find({ ownerId: id });

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

// =====================MENU========================
app.get("/menus", async (req, res) => {
  try {
    const menu = await Menu.find();

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/restaurant-menus/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await Menu.find({ restaurantId: id });

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/menus/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await Menu.findById(id);

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/menus", async (req, res) => {
  try {
    const menuModel = new Menu(req.body);
    const menu = await menuModel.save();

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/menus/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await Menu.findByIdAndUpdate(id, req.body);

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/menus/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await Menu.findByIdAndDelete(id);

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =====================CART========================
app.get("/cart/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await Cart.findOne({ userId: id });

    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { menuItem, quantity, totalPrice } = req.body.products[0];
    const idItem = req.body.products[0].menuItem._id;
    const cart = await Cart.findOne({ userId: id });

    if (cart) {
      // Check if the product already exists in the cart
      const productIndex = cart.products.findIndex(
        (product) => product.menuItem._id === idItem
      );

      if (productIndex >= 0) {
        // If the product exists, update its quantity and totalPrice
        cart.products[productIndex].quantity += quantity;
        cart.products[productIndex].totalPrice += totalPrice;
      } else {
        // If the product does not exist, add it as a new entry
        cart.products.push({
          menuItem,
          quantity,
          totalPrice: menuItem.price * quantity,
        });
      }
    } else {
      // If the cart does not exist, create a new one
      const cartModel = new Cart({
        userId: id,
        products: [
          {
            menuItem,
            quantity,
            totalPrice: menuItem.price * quantity,
          },
        ],
      });
      await cartModel.save();
      return res.status(200).json(cartModel);
    }

    // Save the updated cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
});

app.put("/cart/:id", async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  try {
    const cart = await Cart.findOne({ userId: id });
    cart.products = products;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =====================CHECKOUT========================
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({
      error: error.message,
    });
  }
});

app.post("/order", async (req, res) => {
  const { userId } = req.body;

  try {
    const orderModel = new Order({ ...req.body, status: "In Progress" });
    const order = await orderModel.save();

    await Cart.findOneAndDelete({ userId });

    return res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/order/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const orders = await Order.find({ userId: id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
