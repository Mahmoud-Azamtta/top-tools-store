import favoriteModel from "../../../DB/model/favorite.model.js";
import { AppError } from "../../utls/AppError.js";

export const createFavList = async (req, res, next) => {
  const { productId } = req.body;
  const favorite = await favoriteModel.findOne({ userId: req.user._id });
  if (!favorite) {
    const newFavorite = await favoriteModel.create({
      userId: req.user._id,
      products: { productId },
    });
    return res.json({
      message: "Add to favorite successfully",
      carts: newFavorite,
    });
  }
  for (let i = 0; i < favorite.products.length; i++) {
    if (favorite.products[i].productId == productId) {
      return next(new AppError(`products already exists`, 409));
    }
  }
  favorite.products.push({ productId: productId });
  await favorite.save();
  return res.json({ message: "Add to favorite successfully", favorite });
};

export const getFavorites = async (req, res) => {
  const favorite = await favoriteModel
    .findOne({ userId: req.user._id })
    .populate({
      path: "products.productId",
      select: "name image slug minPrice minDiscount subcategoryId",
    });

  if (!favorite) {
    return res
      .status(404)
      .json({ message: "No favorites found for this user" });
  }

  const populatedProducts = favorite.products.map((item) => ({
    productId: item.productId._id,
    name: item.productId.name,
    slug: item.productId.slug,
    image: item.productId.image,
    price: item.productId.minPrice,
    discount: item.productId.minDiscount,
    subcategoryId: item.productId.subcategoryId,
  }));

  return res.status(200).json({
    message: "success",
    count: populatedProducts.length,
    products: populatedProducts,
  });
};

export const removeItem = async (req, res) => {
  const { productId } = req.params;
  const favorite = await favoriteModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: productId,
        },
      },
    },
    { new: true },
  );
  return res.json({ message: "Removed successfully", favorite });
};

export const clearFavList = async (req, res) => {
  const favorite = await favoriteModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      products: [],
    },
    { new: true },
  );
  return res.json({ message: "success", favorite });
};
