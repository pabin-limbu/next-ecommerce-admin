import { mongooseConect } from "@/lib/mongoose";
import { Order } from "@/models/order";

export default async function handler(req, res) {
  const { method } = req;
  if (method === "GET") {
    await mongooseConect();
    res.json({ message: "hi" });
  }
}
