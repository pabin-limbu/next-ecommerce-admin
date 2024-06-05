import { mongooseConect } from "@/lib/mongoose";
import multiparty from "multiparty";
import fs from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import Banner from "@/models/banner";
import mime from "mime-types";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConect();

  if (method === "POST") {
    try {
      const form = new multiparty.Form();
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });
      //   console.log(req.body);
      //create s3 client.
      const client = new S3Client({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      });
      //create s3 data.
      const ext = files.bannerImage[0].originalFilename.split(".").pop();
      const newFilename = Date.now() + "." + ext;
      // upload to s3.
      const bucketName = "next-ecommerce-pabin"; // must be specific to s3 bucket.
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: newFilename,
          Body: fs.readFileSync(files.bannerImage[0].path),
          ACL: "public-read",
          ContentType: mime.lookup(files.bannerImage[0].path),
        })
      );

      // create image link.
      const imageLink = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;

      // create data for mongo db.
      const { title, description, productId } = fields;

      console.log(fields);

      const banner = new Banner({
        title: title[0],
        description: description[0],
        productId: productId[0],
        bannerImage: imageLink,
      });
      // save mongo db data.
      const result = await banner.save();
      // return mongodb data.
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  if (method === "GET") {
    try {
      const data = await Banner.find({});
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  }

  if (method === "PUT") {
    return res.send("not yet implemented");
  }

  if (method === "DELETE") {
    try {
      const { _id } = req.query;
      const result = await Banner.deleteOne({ _id });

      if (result.deletedCount > 0) {
        return res.status(200).json({ message: "Delete Successfull" });
      } else {
        throw new Error("Unable to delete banner");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  }
}

export const config = {
  api: { bodyParser: false },
};
