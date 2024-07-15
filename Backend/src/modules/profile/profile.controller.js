import bcrypt from "bcryptjs";
import userModel from "../../../DB/model/user.model.js";
import { AppError } from "../../utls/AppError.js";

export const getUserDate = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError(`User not found`, 404));
  }

  const orders = await userModel.findById(userId).populate({
    path: "orders",
    populate: {
      path: "products.productId",
      select: "name slug variants image",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id",
      },
    },
  });

  if (!orders) {
    return next(new AppError("No orders found", 404));
  }

  const ordersWithItemNos = orders.orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );
      return {
        productId: product.productId._id,
        productName: product.productId.name,
        slug: product.productId.slug,
        image: product.productId.image,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant",
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        finalPrice: product.finalPrice,
      };
    });

    return {
      ...order.toObject(),
      products,
    };
  });

  return res.json({
    message: "success",
    user: user,
    orders: ordersWithItemNos,
  });
};

export const updateUserDate = async (req, res, next) => {
  const { userName, email, Address, phoneNumber } = req.body;

  if (
    await userModel.findOne({
      email: req.body.email,
      _id: { $ne: req.user._id },
    })
  ) {
    return next(new AppError(`email ${req.body.email} already exists`, 409));
  }

  const User = await userModel.updateOne(
    { _id: req.user._id },
    { $set: { userName, email, Address, phoneNumber } },
  );
  return res.json({ message: "success" });
};

export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, checkPassword } = req.body;

  const user = await userModel.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (currentPassword === newPassword) {
    return next(new AppError("Newpassword and currentPassword same", 400));
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return next(new AppError("Incorrect current password", 400));
  }

  user.password = await bcrypt.hash(
    newPassword,
    parseInt(process.env.SALT_ROUND),
  );

  await user.save();

  res.status(200).json({ message: "success" });
};

