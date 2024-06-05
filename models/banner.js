const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  bannerImage: { type: String, required: true },
  productId: { type: mongoose.Types.ObjectId, required: true },
});

const Banner =
  mongoose.models?.Banner || mongoose.model("Banner", bannerSchema); // If model already created else create new.

export default Banner;
