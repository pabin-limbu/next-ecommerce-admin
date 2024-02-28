// this is used to create connection with mongo db while making api request.

import mongoose from "mongoose";

export function mongooseConect() {
  const uri = process.env.MONGODB_URI;
  if (mongoose.connection.readyState === 1) {
    //if aleady connected just return the mongoose conection promise .
    return mongoose.connection.asPromise();
  } else {
    // if not already connected then make a connection.
    return mongoose.connect(uri);
  }
}
