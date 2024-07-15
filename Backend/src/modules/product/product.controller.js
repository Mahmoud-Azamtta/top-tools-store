import categoryModel from "../../../DB/model/category.model.js";
import productModel from "../../../DB/model/product.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../utls/cloudinary.js";
import { pagination } from "../../utls/pagination.js";
import { createArabicSlug } from "../createSlug.js";
import { AppError } from "../../utls/AppError.js";
import { getAvgRating } from "../review/review.controller.js";

export const createProduct = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  const { brand, specifications, categoryId, subcategoryId, special } =
    req.body;

  const product = await productModel.findOne({ name });
  if (product) {
    return next(new AppError(`product ${name} already exists`, 409));
  }
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new AppError(`category not found`, 404));
  }
  const subcategory = await subcategoryModel.findById(subcategoryId);
  if (!subcategory) {
    return next(new AppError(`subcategory not found`, 404));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/products`,
    },
  );
  let variant = req.body.variants;
  let variantObj = JSON.parse(variant);
  let variants = variantObj.items;
  variants = variants.map((variant) => {
    variant.finalPrice =
      variant.price -
      ((variant.price * (variant.discount || 0)) / 100).toFixed(2);
    return variant;
  });

  const prices = variants.map((variant) => variant.price);
  const minPrice = Math.min(...prices);

  let discountMinPrice = 0;
  variants.forEach((variant) => {
    if (variant.price === minPrice) {
      discountMinPrice = variant.discount || 0;
    }
  });
  const productCreated = await productModel.create({
    name,
    slug: createArabicSlug(name),
    image: { secure_url, public_id },
    categoryId,
    subcategoryId,
    brand,
    variants,
    specifications,
    special,
    minPrice,
    minDiscount: discountMinPrice,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  return res.status(201).json({ message: "success", productCreated });
};
export const getAllProducts = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  let queryObj = { ...req.query };
  const execQuery = ["page", "limit", "sort", "search", "fields"];
  execQuery.map((ele) => {
    delete queryObj[ele];
  });
  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(/gt|gte|lt|lte|nin|eq/g, (match) => `$${match}`);
  queryObj = JSON.parse(queryObj);

  const mongooseQuery = productModel
    .find(queryObj)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "userName -_id",
      },
    });
  if (req.query.search) {
    mongooseQuery.find({
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { specifications: { $regex: req.query.search, $options: "i" } },
      ],
    });
  }
  mongooseQuery.select(req.query.fields);

  let products = await mongooseQuery.sort(req.query.sort).lean(); // إضافة .lean()

  let productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const avgRating = await getAvgRating(product._id);
      return { ...product, avgRating };
    }),
  );

  const countAllProducts = await productModel.estimatedDocumentCount();

  return res.status(200).json({
    message: "success",
    countAllProducts,

    count: productsWithRatings.length,
    products: productsWithRatings,
  });
};
export const getAllProductsSub = async (req, res, next) => {
  const { id } = req.params;
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const subcategory = await subcategoryModel.findById(id);
  if (!subcategory) {
    return next(new AppError(`Subcategory not found`, 404));
  }
  let queryObj = { ...req.query };
  const execQuery = ["page", "limit", "sort", "search", "fields"];
  execQuery.map((ele) => {
    delete queryObj[ele];
  });

  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(/gt|gte|lt|lte|nin|eq/g, (match) => `$${match}`);
  queryObj = JSON.parse(queryObj);
  queryObj.subcategoryId = id;

  const mongooseQuery = productModel
    .find(queryObj)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "userName -_id",
      },
    });

  if (req.query.search) {
    mongooseQuery.find({
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { specifications: { $regex: req.query.search, $options: "i" } },
      ],
    });
  }

  mongooseQuery.select(req.query.fields);
  let products = await mongooseQuery.sort(req.query.sort).lean();

  let productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const avgRating = await getAvgRating(product._id.toString());
      return { ...product, avgRating };
    }),
  );

  const countAllProducts = await productModel.estimatedDocumentCount();

  return res.status(200).json({
    message: "success",
    countAllProducts,
    count: productsWithRatings.length,
    products: productsWithRatings,
  });
};
export const getActiveProducts = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  let queryObj = { ...req.query };
  const execQuery = ["page", "limit", "sort", "search", "fields"];
  execQuery.map((ele) => {
    delete queryObj[ele];
  });
  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(/gt|gte|lt|lte|nin|eq/g, (match) => `$${match}`);
  queryObj = JSON.parse(queryObj);
  queryObj.status = "Active";

  const mongooseQuery = productModel
    .find(queryObj)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "userName -_id",
      },
    });

  if (req.query.search) {
    mongooseQuery.find({
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { specifications: { $regex: req.query.search, $options: "i" } },
      ],
    });
  }
  mongooseQuery.select(req.query.fields);
  let products = await mongooseQuery.sort(req.query.sort).lean();

  let productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const avgRating = await getAvgRating(product._id.toString());
      return { ...product, avgRating };
    }),
  );

  const countAllProducts = await productModel.estimatedDocumentCount();

  return res.status(200).json({
    message: "success",
    countAllProducts,
    count: productsWithRatings.length,
    products: productsWithRatings,
  });
};
export const getActiveProductsSub = async (req, res, next) => {
  const { id } = req.params;
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const subcategory = await subcategoryModel.findById(id);
  if (!subcategory) {
    return next(new AppError(`subcategory not found`, 404));
  }
  let queryObj = { ...req.query };
  const execQuery = ["page", "limit", "sort", "search", "fields"];
  execQuery.map((ele) => {
    delete queryObj[ele];
  });
  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(/gt|gte|lt|lte|nin|eq/g, (match) => `$${match}`);
  queryObj = JSON.parse(queryObj);
  queryObj.subcategoryId = id;
  queryObj.status = "Active";

  const mongooseQuery = productModel
    .find(queryObj)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "userName -_id",
      },
    });

  if (req.query.search) {
    mongooseQuery.find({
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { specifications: { $regex: req.query.search, $options: "i" } },
      ],
    });
  }
  mongooseQuery.select(req.query.fields);
  let products = await mongooseQuery.sort(req.query.sort).lean();

  let productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const avgRating = await getAvgRating(product._id.toString());
      return { ...product, avgRating };
    }),
  );

  const countAllProducts = await productModel.estimatedDocumentCount();

  return res.status(200).json({
    message: "success",
    countAllProducts,
    count: productsWithRatings.length,
    products: productsWithRatings,
  });
};
export const getDetailProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel
    .findById(id)
    .populate({
      path: "categoryId",
      select: "name slug",
    })
    .populate({
      path: "subcategoryId",
      select: "name slug",
    })
    .populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "userName -_id",
      },
    })
    .lean();

  if (!product) {
    return next(new AppError(`Product not found`, 404));
  }

  const avgRating = await getAvgRating(product._id.toString());
  const productWithRating = { ...product, avgRating };

  productWithRating.image = product.image
    ? product.image.secure_url
    : undefined;

  await productModel.updateOne({ _id: id }, { $inc: { views: 1 } });

  return res
    .status(200)
    .json({ message: "success", product: productWithRating });
};
export const getProductsSpecial = async (req, res, next) => {
  const products = await productModel.find().sort({ views: -1 }).limit(8);
  return res.status(200).json({ message: "success", products });
};
export const getPopularProducts = async (req, res, next) => {
  const products = await productModel.find().sort({ numOfOrders: -1 }).limit(8);
  return res.status(200).json({ message: "success", products });
};
export const getAllProductsDiscount = async (req, res, next) => {
  const productsWithDiscount = await productModel.find({
    "variants.discount": { $gt: 0 },
  });

  if (productsWithDiscount.length === 0) {
    return next(new AppError(`No product containing offers`, 404));
  }
  const countAllProducts = await productModel.estimatedDocumentCount();
  return res.status(200).json({
    message: "success",
    countAllProducts,
    count: productsWithDiscount.length,
    products: productsWithDiscount,
  });
};
export const getLessTenProducts = async (req, res, next) => {
  try {
    const products = await productModel.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.inStoke": { $gt: 0 } } },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          slug: { $first: "$slug" },
          image: { $first: "$image" },
          brand: { $first: "$brand" },
          specifications: { $first: "$specifications" },
          status: { $first: "$status" },
          special: { $first: "$special" },
          del: { $first: "$del" },
          minPrice: { $first: "$minPrice" },
          minDiscount: { $first: "$minDiscount" },
          views: { $first: "$views" },
          numOfOrders: { $first: "$numOfOrders" },
          categoryId: { $first: "$categoryId" },
          subcategoryId: { $first: "$subcategoryId" },
          createdBy: { $first: "$createdBy" },
          updatedBy: { $first: "$updatedBy" },
          totalInStoke: { $sum: "$variants.inStoke" },
          variants: { $push: "$variants" },
        },
      },
      { $sort: { totalInStoke: 1 } },
      { $limit: 10 },
    ]);

    return res.status(200).json({ message: "success", products });

    return res.status(200).json({ message: "success", products });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
export const getUnpopularProducts = async (req, res, next) => {
  const products = await productModel.find().sort({ numOfOrders: 1 }).limit(15);
  return res.status(200).json({ message: "success", products });
};
export const getLatestProducts = async (req, res, next) => {
  const products = await productModel.find().sort({ createdAt: -1 }).limit(8);
  return res.status(200).json({ message: "success", products });
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new AppError(`product not found`, 404));
  }
  product.name = req.body.name.toLowerCase(); //  Note: product.name = req.body.name
  if (
    await productModel.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
    })
  ) {
    return next(new AppError(`product ${req.body.name} already exists`, 409));
  }
  product.slug = createArabicSlug(req.body.name);
  product.brand = req.body.brand;
  product.specifications = req.body.specifications;
  product.status = req.body.status;

  let variant = req.body.variants;
  let variantObj = JSON.parse(variant);
  let variants = variantObj.items;
  product.variants = variants;

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/products` },
    );
    await cloudinary.uploader.destroy(product.image.public_id);
    product.image = { secure_url, public_id };
  }

  product.updatedBy = req.user._id;
  await product.save();
  return res.status(200).json({ message: "success", product });
};
export const updateProductStatus = async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new AppError(`product not found`, 404));
  }
  product.status = req.body.status;
  product.updatedBy = req.user._id;
  await product.save();
  return res.status(200).json({ message: "success", product });
};
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new AppError(`subcategroy not found`, 404));
  }
  await cloudinary.uploader.destroy(product.image.public_id);
  await productModel.findByIdAndDelete(id);
  return res.status(200).json({ message: "success" });
};

export const getRecommended = async (req, res) => {
  try {
    const id = req.user._id;
    const response = await fetch(`${process.env.AI_API}/get-recommended/${id}`);
    if (!response.ok) {
      throw new Error("Network error or user has no favorites");
    }

    const recommendedProducts = await response.json();

    const productIds = [
      ...new Set(recommendedProducts.map((product) => product.id)),
    ];
    const fullProducts = await productModel.find({ _id: { $in: productIds } });

    const productMap = fullProducts.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});

    const detailedRecommendedProducts = recommendedProducts.map(
      (product) => productMap[product.id],
    );

    return res.json(detailedRecommendedProducts);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occured with the flask api" });
  }
};
