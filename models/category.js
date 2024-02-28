const { Schema, model, models, default: mongoose } = require("mongoose");

const categorySchema = new Schema({
  name: { type: String, required: true },
  properties: [{ type: Object }],
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
});

export const Category = models?.Category || model("Category", categorySchema); // If model already created else create new.
