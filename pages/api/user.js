import { mongooseConect } from "@/lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  if (method === "GET") {
    await mongooseConect();
    res.json({ message: "hi" });
  }
}
