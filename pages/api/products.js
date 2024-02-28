import { mongooseConect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConect(); // we can use this to get active connection if active or create new connection because we have wrapper component in lib/mongodb file.
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    console.log("i am in api/products post");
    const { title, description, price, images, category, properties } =
      req.body;
    //create a product.
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });

    res.json(productDoc);
  }

  if (method === "PUT") {
    console.log("i am in a api/product put method");
    const { title, description, price, images, category, properties, _id } =
      req.body;
    await Product.updateOne(
      { _id: _id },
      { title, description, price, images, category, properties }
    ); // later check the res from database and send the response.
    res.json(true);
  }

  // handle delete
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      console.log("PRODUCT DELETED");
      res.json(true);
    }
  }
}
