import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
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
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
