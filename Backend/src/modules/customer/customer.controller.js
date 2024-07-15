import orderModel from "../../../DB/model/order.model.js";
import userModel from "../../../DB/model/user.model.js";
import { AppError } from "../../utls/AppError.js";

export const getCustomer = async (req, res, next) => {
  const orders = await orderModel.find({ status: "confirmed" });
  if (orders.length === 0) {
    return next(new AppError(`no orders found`, 404));
  }
  const userId = orders.map((order) => order.userId);
  const uniqueUserIds = [...new Set(userId)];
  const users = await userModel.find(
    { _id: { $in: uniqueUserIds } },
    "userName email phoneNumber Address",
  );

  if (users.length === 0) {
    return next(new AppError(`no customers found for orders`, 404));
  }

  const userOrdersCount = orders.reduce((acc, order) => {
    acc[order.userId] = (acc[order.userId] || 0) + 1;
    return acc;
  }, {});

  const usersWithDetails = users.map((user) => ({
    _id: user._id,
    userName: user.userName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    Address: user.Address,
    numOfOrder: userOrdersCount[user._id] || 0,
  }));

  return res.status(200).json({ message: "success", users: usersWithDetails });
};

export const updateCustomerInfo = async (req, res, next) => {
  const userId = req.params.userId;
  const { userName, email, Address, phoneNumber } = req.body;
  const orders = await orderModel.find({ userId: userId });
  if (orders.length === 0) {
    return next(new AppError(`user has not made any ordering`, 404));
  }

  if (
    await userModel.findOne({
      email: req.body.email,
      _id: { $ne: userId },
    })
  ) {
    return next(new AppError(`email ${req.body.email} already exists`, 409));
  }
  const User = await userModel.updateOne(
    { _id: userId },
    { $set: { userName, email, Address, phoneNumber } },
  );
  return res.json({ message: "success" });
};

export const deleteCustomer = async (req, res, next) => {
  const userId = req.params.userId;
  const orders = await orderModel.find({ userId: userId });
  if (orders.length === 0) {
    return next(new AppError(`user has not made ordering`, 404));
  }
  const customer = await orderModel.deleteMany({ userId: userId });
  if (customer.deletedCount === 0) {
    return next(new AppError(`user not found or could not be deleted`, 400));
  }

  return res.json({ message: "user deleted successfully" });
};
export const getCustomerOrders = async (req, res, next) => {
  const userId = req.params.userId;
  const orders = await orderModel.find({ userId: userId }).populate({
    path: "products.productId",
    select: "name variants image",
    populate: {
      path: "variants",
      select: "itemNo finalPrice -_id",
    },
  });

  if (orders.length === 0) {
    return next(new AppError(`No orders found for this user`, 404));
  }

  const ordersWithItemNo = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
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

  return res.json({ message: "success", orders: ordersWithItemNo });
};

export const searchCustomer = async (req, res, next) => {
  const query = req.query.q;
  if (!query) {
    return next(new AppError(`Query parameter "q" is required`, 400));
  }
  const orders = await orderModel.find();
  const userIds = orders.map((order) => order.userId);

  const results = await userModel
    .find({
      $and: [
        { _id: { $in: userIds } },
        {
          $or: [
            { userName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { "Address.city": { $regex: query, $options: "i" } },
            { "Address.street": { $regex: query, $options: "i" } },
            { "Address.description": { $regex: query, $options: "i" } },
          ],
        },
      ],
    })
    .collation({ locale: "ar", strength: 2 });
  res.json(results);
};
