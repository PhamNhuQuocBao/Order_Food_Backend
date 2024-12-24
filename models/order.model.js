import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: String,
  },
  address: {
    street: {
      required: true,
      type: String,
    },
    city: {
      required: true,
      type: String,
    },
  },
  amount: {
    required: true,
    type: Number,
  },
  status: {
    type: String,
  },
  products: {
    required: true,
    type: Array,
  },
});

export const Order = mongoose.model("Order", orderSchema);
