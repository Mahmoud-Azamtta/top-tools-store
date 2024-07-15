import cartModel from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
import { AppError } from "../../utls/AppError.js";

export const createCart = async (req, res, next) => {
  const { productId, itemNo, quantity = 1 } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError(`Product not found`, 404));
  }

  const variant = product.variants.find((variant) => variant.itemNo === itemNo);
  if (!variant) {
    return next(new AppError(`Variant not found`, 404));
  }

  const unitPrice = variant.price;
  const discount = variant.discount || 0;
  const finalPrice =
    parseFloat((unitPrice - (unitPrice * discount) / 100).toFixed(2)) *
    quantity;

  const productToAdd = {
    productId,
    itemNo,
    quantity,
    finalPrice,
    price: unitPrice,
    discount,
  };

  let cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    cart = await cartModel.create({
      userId: req.user._id,
      products: [productToAdd],
    });
  } else {
    const existingProductIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.itemNo === itemNo,
    );

    if (existingProductIndex !== -1) {
      return next(
        new AppError(`Product or variant already exists in the cart`, 409),
      );
    }

    cart.products.push(productToAdd);
    cart.total = cart.products.reduce(
      (acc, product) => acc + product.finalPrice,
      0,
    );
    await cart.save();
  }

  return res.status(200).json({ message: "success", cart });
};

export const getCart = async (req, res) => {
  const cart = await cartModel
    .findOneAndUpdate({ userId: req.user._id }, {}, { new: true })
    .populate({
      path: "products.productId",
      select: "name slug image ",
    });

  if (!cart) {
    return res.status(404).json({ message: "No cart found" });
  }

  return res.json({ message: "success", cart });
};

export const removeItem = async (req, res, next) => {
  const { productId } = req.params;
  const { itemNo } = req.body;

  const updatedCart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: productId,
          itemNo: itemNo,
        },
      },
    },
    { new: true },
  );

  if (!updatedCart) {
    return next(new AppError(`Cart not found`, 409));
  }

  const newTotal = updatedCart.products.reduce((acc, curr) => {
    let productTotal = curr.price * curr.quantity;
    if (curr.discount) {
      productTotal = productTotal - (productTotal * curr.discount) / 100;
    }
    return acc + productTotal;
  }, 0);

  updatedCart.total = newTotal;
  await updatedCart.save();

  return res.json({ message: "success", cart: updatedCart });
};

export const clearCart = async (req, res) => {
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      products: [],
      total: 0,
    },
    { new: true },
  );
  return res.json({ message: "success", cart });
};

export const updateQuantity = async (req, res) => {
  const { quantity, operator, itemNo } = req.body;
  const inc = operator === "+" ? quantity : -quantity;

  const cart = await cartModel.findOne({
    userId: req.user._id,
    "products.productId": req.params.productId,
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  let totalUpdated = 0;

  cart.products = cart.products.map((product) => {
    if (
      product.productId.toString() === req.params.productId &&
      product.itemNo === itemNo
    ) {
      product.quantity += inc;
      totalUpdated += inc;

      const unitPrice = product.price;
      const discount = product.discount || 0;
      product.finalPrice =
        parseFloat((unitPrice - (unitPrice * discount) / 100).toFixed(2)) *
        product.quantity;
    }
    return product;
  });

  cart.products = cart.products.filter((product) => product.quantity > 0);

  cart.total = cart.products.reduce(
    (acc, product) => acc + product.finalPrice,
    0,
  );

  await cart.save();

  if (totalUpdated === 0) {
    return res.status(404).json({ message: "No items updated" });
  }

  return res.json({ message: "success", cart });
};
