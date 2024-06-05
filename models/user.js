const { Schema, model, models, default: mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    isAdmin: { type: boolean, required: true },
    image: String,
  },
  { timestamps: true }
);

export const user = model("users", userSchema); // If model already created else create new.
