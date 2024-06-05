const { Schema, model, models, default: mongoose } = require("mongoose");

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
    stats: [{ type: Object }],
    isFeatured: { type: Boolean },
    isVintage: { type: Boolean },
  },
  { timestamps: true }
);

export const Product = models.Product || model("Product", productSchema); // If model already created else create new.
