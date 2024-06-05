import { mongooseConect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConect(); // we can use this to get active connection if active or create new connection because we have wrapper component in lib/mongodb file.
  //await isAdminRequest(req, res);

  if (method === "GET") {
    console.log("i reached here");
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      console.log("i reached here too");
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    console.log("i am in api/products post");
    const {
      title,
      description,
      price,
      images,
      category,
      properties,
      stats,
      isFeatured,
      isVintage,
    } = req.body;

    //create a product.
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
      stats,
      isFeatured,
      isVintage: true,
    });

    console.log(productDoc);

    res.json(productDoc);
  }

  if (method === "PUT") {
    const {
      title,
      description,
      price,
      images,
      category,
      properties,
      stats,
      isFeatured,
      isVintage,
      _id,
    } = req.body;
    await Product.updateOne(
      { _id: _id },
      {
        title,
        description,
        price,
        images,
        category,
        properties,
        stats,
        isFeatured,
        isVintage,
      }
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
