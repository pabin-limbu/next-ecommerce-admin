import { mongooseConect } from "@/lib/mongoose";
import { Category } from "@/models/category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConect();
  //await isAdminRequest(req, res);

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }
  if (method == "POST") {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name,
      properties,
      parent: parentCategory || undefined,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    const { name, parentCategory, properties, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        properties,
        parent: parentCategory || undefined,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    const categoryDoc = await Category.deleteOne({ _id });

    if (categoryDoc.deletedCount > 0) {
      return res.json("ok");
    }
  }
}
