import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { isAdminRequest } from "./auth/[...nextauth]";
import { mongooseConect } from "@/lib/mongoose";
const bucketName = "next-ecommerce-pabin"; // must be specific to s3 bucket.

export default async function handle(req, res) {
  await mongooseConect();
  await isAdminRequest(req, res);
  // tell next to dont parse our req, instead we want to parse it ourself
  // to get files from our req, we will use library called multiparty. from yarnpkg.com
  //multiparty: Parse http requests with content-type multipart/form-data, also known as file uploads.
  const form = new multiparty.Form();

  // using a promise.
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      //parsing multiparty form from req to fields and file.basically imbadding it here.
      resolve({ fields, files });
    });
  });

  // use this client to upload image in s3 bucket.
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const links = []; // if we have several files.

  // To get the body we need to read the file and to do so we need to use fs from fs library.
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    //console.log({ ext, file, newFilename });
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );

    //after we upload the file we need to get the link of this file for the db.
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }

  return res.json({ links });
}

//This will prevent parsing of data into json , instead we will have arra yof data.
export const config = {
  api: { bodyParser: false },
};
