import "dotenv/config";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

export default cloudinary.v2;

