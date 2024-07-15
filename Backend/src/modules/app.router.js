import cors from "cors";
import authRouter from "./auth/auth.router.js";
import categoryRouter from "./category/category.router.js";
import subcategoryRouter from "./subcategory/subcategory.router.js";
import productRouter from "./product/product.router.js";
import cartRouter from "./cart/cart.router.js";
import orderRouter from "./order/order.router.js";
import profileRouter from "./profile/profile.router.js";
import customerRouter from "./customer/customer.router.js";
import favoriteRouter from "./favorite/favorite.router.js";
import couponRouter from "./coupon/coupon.router.js";
import reviewRouter from "./review/review.router.js";
import connectDB from "../../DB/connection.js";

const initApp = async (app, express) => {
  await connectDB();
  const corsOptions = {
    origin: ["https://top-tools.store", "http://localhost:5173"], // الدومين المسموح به
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  app.use(cors(corsOptions));

  app.use(express.json());
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "welcome" });
  });

  app.use("/auth", authRouter);
  app.use("/categories", categoryRouter);
  app.use("/subcategory", subcategoryRouter);
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/customer", customerRouter);
  app.use("/favorite", favoriteRouter);
  app.use("/coupon", couponRouter);
  app.use("/review", reviewRouter);
  app.use("/profile", profileRouter);
  app.use("*", (req, res) => {
    return res.status(404).json({ message: "page not found" });
  });
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Use 500 as a default status code
    res.status(statusCode).send({
      status: "error",
      message: err.message,
    });
  });
};
export default initApp;

