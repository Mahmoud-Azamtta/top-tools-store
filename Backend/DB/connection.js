import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("connected successfully");
    })
    .catch((err) => {
      console.log(`error to connect db ${err}`);
    });
};

export default connectDB;

