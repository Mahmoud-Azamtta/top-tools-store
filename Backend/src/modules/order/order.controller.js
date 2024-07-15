import cartModel from "../../../DB/model/cart.model.js";
import couponModel from "../../../DB/model/coupon.model.js";
import orderModel from "../../../DB/model/order.model.js";
import productModel from "../../../DB/model/product.model.js";
import userModel from "../../../DB/model/user.model.js";
import { AppError } from "../../utls/AppError.js";
import createInvoice from "../../utls/pdf.js";
import { sendEmailPDF } from "../../utls/sendEmail.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createOrder = async (req, res, next) => {
  const { couponName } = req.body;
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart || cart.products.length === 0) {
    return next(new AppError(`Cart is empty`, 400));
  }

  req.body.products = cart.products;

  if (!Array.isArray(req.body.products)) {
    return next(new AppError(`Products list is not iterable`, 400));
  }

  await Promise.all(
    cart.products.map(async (cartItem) => {
      const product = await productModel.findById(cartItem.productId);
      if (product) {
        product.numOfOrders += 1;
        await product.save();
      }
    }),
  );

  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName });
    if (!coupon) {
      return next(new AppError(`Coupon not found`, 404));
    }
    const currentDate = new Date();
    if (coupon.expireDate <= currentDate) {
      return next(new AppError(`This coupon has expired`, 400));
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return next(new AppError(`Coupon already used`, 409));
    }
    req.body.coupon = coupon;
  }

  let subTotals = 0;
  let finalProductList = [];

  for (let product of req.body.products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
    });

    if (!checkProduct) {
      return next(
        new AppError(
          `Product with ID ${product.productId} not found in the database.`,
          404,
        ),
      );
    }

    let variant = checkProduct.variants.find(
      (variant) =>
        variant.itemNo === product.itemNo &&
        variant.inStoke >= product.quantity,
    );
    if (!variant) {
      return next(
        new AppError(
          `No stock for product ID ${product.productId} with item number ${product.itemNo}.`,
          404,
        ),
      );
    }

    const price = variant.price || 0;
    const discount = variant.discount || 0;
    const finalPrice = parseFloat(
      (price - (price * discount) / 100).toFixed(2),
    );
    const costForVariant = product.quantity * finalPrice;

    if (isNaN(finalPrice) || isNaN(costForVariant)) {
      return next(
        new AppError(
          `Invalid price calculation for product ID ${product.productId} with item number ${product.itemNo}.`,
          400,
        ),
      );
    }

    subTotals += costForVariant;
    finalProductList.push({
      productId: product.productId,
      name: checkProduct.name,
      itemNo: variant.itemNo,
      quantity: product.quantity,
      unitPrice: price,
      discount: discount,
      finalPrice: costForVariant,
    });

    await productModel.updateOne(
      { _id: product.productId, "variants.itemNo": variant.itemNo },
      { $inc: { "variants.$.inStoke": -product.quantity } },
    );
  }

  const user = await userModel.findById(req.user._id);
  const address = req.body.Address || user.Address;
  const phone = req.body.phoneNumber || user.phoneNumber;

  const order = await orderModel.create({
    userId: req.user._id,
    products: finalProductList,
    finalPrice: subTotals - (subTotals * (req.body.coupon?.amount || 0)) / 100,
    Address: address,
    phoneNumber: phone,
  });

  if (order) {
    const invoicePath = "invoice.pdf";
    const invoice = {
      shipping: {
        name: user.userName,
        address: `${order.Address.city},${order.Address.street}, ${order.Address.description}`,

        phone: order.phoneNumber,
      },
      items: finalProductList,
      subtotal: order.finalPrice,

      invoice_nr: order._id,
    };

    createInvoice(invoice, invoicePath);

    if (req.body.coupon) {
      await couponModel.updateOne(
        { _id: req.body.coupon._id },
        { $addToSet: { usedBy: req.user._id } },
      );
    }

    await cartModel.updateOne(
      { userId: req.user._id },
      { $set: { products: [], total: 0 } },
    );

    const emailBody = `<p>Dear ${user.userName},</p><p>Your order has been processed successfully. Please find your invoice attached.</p>`;
    await sendEmailPDF(
      user.email,
      "Order Confirmation and Invoice",
      emailBody,
      invoicePath,
    );
  }

  return res.status(201).json({ message: "success", order });
};

export const createOrderVisa = async (req, res, next) => {
  const { couponName } = req.body;
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart || cart.products.length === 0) {
    return next(new AppError(`Cart is empty`, 400));
  }

  req.body.products = cart.products;

  if (!Array.isArray(req.body.products)) {
    return next(new AppError(`Products list is not iterable`, 400));
  }

  await Promise.all(
    cart.products.map(async (cartItem) => {
      const product = await productModel.findById(cartItem.productId);
      if (product) {
        product.numOfOrders += 1;
        await product.save();
      }
    }),
  );

  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName });
    if (!coupon) {
      return next(new AppError(`Coupon not found`, 404));
    }
    const currentDate = new Date();
    if (coupon.expireDate <= currentDate) {
      return next(new AppError(`This coupon has expired`, 400));
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return next(new AppError(`Coupon already used`, 409));
    }
    req.body.coupon = coupon;
  }

  let subTotals = 0;
  let finalProductList = [];

  for (let product of req.body.products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
    });

    if (!checkProduct) {
      return next(
        new AppError(
          `Product with ID ${product.productId} not found in the database.`,
          404,
        ),
      );
    }

    let variant = checkProduct.variants.find(
      (variant) =>
        variant.itemNo === product.itemNo &&
        variant.inStoke >= product.quantity,
    );
    if (!variant) {
      return next(
        new AppError(
          `No stock for product ID ${product.productId} with item number ${product.itemNo}.`,
          404,
        ),
      );
    }

    const price = variant.price || 0;
    const discount = variant.discount || 0;
    const finalPrice = parseFloat(
      (price - (price * discount) / 100).toFixed(2),
    );
    const costForVariant = product.quantity * finalPrice;

    if (isNaN(finalPrice) || isNaN(costForVariant)) {
      return next(
        new AppError(
          `Invalid price calculation for product ID ${product.productId} with item number ${product.itemNo}.`,
          400,
        ),
      );
    }

    subTotals += costForVariant;
    finalProductList.push({
      productId: product.productId,
      name: checkProduct.name,
      itemNo: variant.itemNo,
      quantity: product.quantity,
      unitPrice: price,
      discount: discount,
      finalPrice: costForVariant,
    });

    await productModel.updateOne(
      { _id: product.productId, "variants.itemNo": variant.itemNo },
      { $inc: { "variants.$.inStoke": -product.quantity } },
    );
  }

  const user = await userModel.findById(req.user._id);
  const address = req.body.Address || user.Address;
  const phone = req.body.phoneNumber || user.phoneNumber;
  const order = await orderModel.create({
    userId: req.user._id,
    products: finalProductList,
    finalPrice: subTotals - (subTotals * (req.body.coupon?.amount || 0)) / 100,
    Address: address,
    phoneNumber: phone,
    paymentType: "card",
    completed: false,
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "USD",
          unit_amount: Math.round(
            (subTotals - (subTotals * (req.body.coupon?.amount || 0)) / 100) *
              100 *
              0.28,
          ),
          product_data: {
            name: user.userName,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.BASE_URL}/order/confirmOrder/${order._id}`,
    cancel_url: `${process.env.BASE_URL}/order/deleteOrder/${order._id}`,
  });
  return res.status(200).json({ url: session.url });
};

export const confirmComplete = async (req, res) => {
  const { orderId } = req.params;
  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }
  order.completed = true;
  order.paymentType = cart;
  await order.save();
  if (order) {
    const invoicePath = "invoice.pdf";
    const invoice = {
      shipping: {
        name: user.userName,
        address: `${order.Address.city},${order.Address.street}, ${order.Address.description}`,

        phone: order.phoneNumber,
      },
      items: finalProductList,
      subtotal: order.finalPrice,

      invoice_nr: order._id,
    };

    createInvoice(invoice, invoicePath);

    if (req.body.coupon) {
      await couponModel.updateOne(
        { _id: req.body.coupon._id },
        { $addToSet: { usedBy: req.user._id } },
      );
    }

    await cartModel.updateOne(
      { userId: req.user._id },
      { $set: { products: [], total: 0 } },
    );

    const emailBody = `<p>Dear ${user.userName},</p><p>Your order has been processed successfully. Please find your invoice attached.</p>`;
    await sendEmailPDF(
      user.email,
      "Order Confirmation and Invoice",
      emailBody,
      invoicePath,
    );
  }

  return res.status(201).json({ message: "success", order });
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await orderModel.findByIdAndDelete(orderId);
  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }
  return res.json({ message: "success", order });
};

//     Get All Orders
export const getAllOrders = async (req, res) => {
  const orders = await orderModel
    .find({})
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo price finalPrice -_id",
      },
    })
    .populate({ path: "userId", select: "userName " });

  if (!orders) {
    return next(new AppError("No orders found", 404));
  }

  const ordersWithDetails = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        finalPrice: product.finalPrice,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant", // إضافة itemNo
      };
    });

    return {
      ...order.toObject(),
      products,
    };
  });

  return res
    .status(200)
    .json({ message: "success", orders: ordersWithDetails });
};

export const getPendingOrders = async (req, res, next) => {
  const orders = await orderModel
    .find({ status: "pending" })
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id",
      },
    })
    .populate({ path: "userId", select: "userName " });

  if (!orders || orders.length === 0) {
    return next(new AppError("No pending orders found", 404));
  }

  const ordersWithProduct = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        finalPrice: product.finalPrice,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant", // إضافة itemNo
      };
    });

    return {
      ...order.toObject(),
      products,
    };
  });

  return res
    .status(200)
    .json({ message: "success", orders: ordersWithProduct });
};
export const getConfirmedOrders = async (req, res, next) => {
  const orders = await orderModel
    .find({ status: "confirmed" })
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id",
      },
    })
    .populate({ path: "userId", select: "userName " });

  if (!orders || orders.length === 0) {
    return next(new AppError("No confirmed orders found", 404));
  }

  const ordersWithProduct = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        finalPrice: product.finalPrice,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant", // إضافة itemNo
      };
    });

    return {
      ...order.toObject(),
      products,
    };
  });

  return res
    .status(200)
    .json({ message: "success", orders: ordersWithProduct });
};
export const getDeliveredOrders = async (req, res, next) => {
  const orders = await orderModel
    .find({ status: "delivered" })
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id",
      },
    })
    .populate({ path: "userId", select: "userName " });

  if (!orders || orders.length === 0) {
    return next(new AppError("No delivered orders found", 404));
  }

  const ordersWithProduct = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        finalPrice: product.finalPrice,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant", // إضافة itemNo
      };
    });

    return {
      ...order.toObject(),
      products,
    };
  });

  return res
    .status(200)
    .json({ message: "success", orders: ordersWithProduct });
};

// Get User Order
export const userOrders = async (req, res, next) => {
  const { id } = req.params;
  const orders = await orderModel
    .find({ userId: id })
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id",
      },
    })
    .populate({ path: "userId", select: "userName " });

  if (!orders || orders.length === 0) {
    return next(new AppError("No  orders ", 404));
  }

  const ordersWithProduct = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        finalPrice: product.finalPrice,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant", // إضافة itemNo
      };
    });

    return {
      ...order.toObject(),
      products,
    };
  });

  return res
    .status(200)
    .json({ message: "success", orders: ordersWithProduct });
};

export const userPendingOrders = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new AppError(`User not found`, 404));
  }
  const orders = await orderModel
    .find({ userId: id, status: "pending" })
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id",
      },
    })
    .populate({ path: "userId", select: "userName " });

  if (!orders || orders.length === 0) {
    return next(new AppError("No pending orders found for this user", 404));
  }

  const ordersWithProduct = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant", // إضافة itemNo
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

  return res
    .status(200)
    .json({ message: "success", orders: ordersWithProduct });
};

export const userConfirmedOrders = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new AppError(`User not found`, 404));
  }
  const orders = await orderModel
    .find({ userId: id, status: "confirmed" })
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id", // استرجاع itemNo و finalPrice من كل variant
      },
    })
    .populate({ path: "userId", select: "userName " });

  if (!orders || orders.length === 0) {
    return next(new AppError("No confirmed orders found for this user", 404));
  }

  const ordersWithProduct = orders.map((order) => {
    const products = order.products.map((product) => {
      // تحديد ال variant التي تطابق unitPrice لاستخراج itemNo
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant", // إضافة itemNo
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

  return res
    .status(200)
    .json({ message: "success", orders: ordersWithProduct });
};

export const userDeliveredOrders = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new AppError(`User not found`, 404));
  }
  const orders = await orderModel
    .find({ userId: id, status: "delivered" })
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id",
      },
    })
    .populate({ path: "userId", select: "userName " });

  if (!orders || orders.length === 0) {
    return next(new AppError("No delivered orders found for this user", 404));
  }

  const ordersWithProduct = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
        itemNo: purchasedVariant
          ? purchasedVariant.itemNo
          : "No matching variant", // إضافة itemNo
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

  return res
    .status(200)
    .json({ message: "success", orders: ordersWithProduct });
};

export const getLatestPendingOrders = async (req, res, next) => {
  const orders = await orderModel
    .find({ status: "pending" })
    .populate({
      path: "products.productId",
      select: "name variants",
      populate: {
        path: "variants",
        select: "itemNo finalPrice -_id", // استرجاع itemNo و finalPrice من كل variant
      },
    })
    .populate({ path: "userId", select: "userName email" })
    .sort({ createdAt: -1 })
    .limit(12);

  const ordersWithProductDetails = orders.map((order) => {
    const products = order.products.map((product) => {
      const purchasedVariant = product.productId.variants.find(
        (variant) => variant.finalPrice === product.unitPrice,
      );

      return {
        productId: product.productId._id,
        productName: product.productId.name,
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
      user: {
        userName: order.userId.userName,
        email: order.userId.email,
      },
      products,
    };
  });
  const count = ordersWithProductDetails.length;
  res
    .status(200)
    .json({ message: "success", count, orders: ordersWithProductDetails });
};

export const changeStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }
  order.status = status;
  order.save();
  return res.json({ message: "success", order });
};

export const updateOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const { phoneNumber, Address } = req.body;
  const updatedOrder = await orderModel.findByIdAndUpdate(
    orderId,
    {
      phoneNumber,
      Address,
    },
    { new: true },
  );

  if (!updatedOrder) {
    next(new AppError(`Order not found`, 404));
  }
  res.status(200).json({ message: "success", updatedOrder });
};

export const CancelOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await orderModel.findById(orderId);

  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }

  if (order.status !== "cancelled" && order.status === "pending") {
    order.status = "cancelled";
    await order.save();

    for (let product of order.products) {
      if (product.variant && product.variant.itemNo) {
        await productModel.updateOne(
          { _id: product.productId, "variants.itemNo": product.variant.itemNo },
          { $inc: { "variants.$.inStoke": product.quantity } },
        );
      } else {
        await productModel.updateOne(
          { _id: product.productId },
          { $inc: { "variants.$[elem].inStoke": product.quantity } },
          { arrayFilters: [{ "elem.inStoke": { $exists: true } }] },
        );
      }
    }

    return res.status(200).json({ message: "success" });
  }

  return next(new AppError(`Order status cannot be canceled`, 400));
};
