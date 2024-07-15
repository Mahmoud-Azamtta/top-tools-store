import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utls/cloudinary.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import productModel from "../../../DB/model/product.model.js";
import { createArabicSlug } from "../createSlug.js";
import mongoose from "mongoose";
import { AppError } from "../../utls/AppError.js";

export const createCategories = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  if (await categoryModel.findOne({ name })) {
    return next(new AppError(`category name already exists`, 409));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/categories` },
  );

  const category = await categoryModel.create({
    name,
    slug: createArabicSlug(name),
    image: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  return res.status(201).json({ message: "success", category });
};

export const getAllCategories = async (req, res) => {
  let category = await categoryModel.find().populate([
    {
      path: "createdBy",
      select: "userName",
    },
    {
      path: "updatedBy",
      select: "userName",
    },
    {
      path: "subcategory",
    },
  ]);
  category = category.map((categories) => {
    return {
      ...categories.toObject(),
      image: categories.image.secure_url,
    };
  });
  return res.status(200).json({ message: "success", category });
};

export const getActiveCategories = async (req, res) => {
  let category = await categoryModel.find({ status: "Active" }).populate({
    path: "subcategory",
    match: { status: "Active" },
    select: "name image slug",
  });
  category = category.map((categories) => {
    return {
      ...categories.toObject(),
      image: categories.image.secure_url,
    };
  });
  return res.status(200).json({ message: "success", category });
};
export const getDetailsCategories = async (req, res, next) => {
  const { categoryId } = req.params;
  let category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new AppError(`category not found`, 404));
  }
  const categoryObject = category.toObject();
  categoryObject.image = category.image.secure_url;

  return res.status(200).json({ message: "success", categoryObject });
};
export const updateCategories = async (req, res, next) => {
  const categoryId = new mongoose.Types.ObjectId(req.params.id);
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new AppError(`Invalid category id ${req.params.id}`, 404));
  }

  category.name = req.body.name.toLowerCase();
  if (
    await categoryModel.findOne({
      name: req.body.name,
      _id: { $ne: categoryId },
    })
  ) {
    return next(new AppError(`Category ${req.body.name} already exists`, 409));
  }
  category.slug = createArabicSlug(req.body.name);
  category.status = req.body.status;

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/categories` },
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }

  category.updatedBy = req.user._id;

  await category.save();

  const subcategories = await subcategoryModel.find({ categoryId: categoryId });
  if (subcategories.length > 0) {
    if (req.body.status === "Inactive") {
      await subcategoryModel.updateMany(
        { categoryId: categoryId },
        { status: "Inactive" },
      );

      await productModel.updateMany(
        { subcategoryId: { $in: subcategories.map((sub) => sub._id) } },
        { status: "Inactive" },
      );
    } else if (req.body.status === "Active") {
      await subcategoryModel.updateMany(
        { categoryId: categoryId },
        { status: "Active" },
      );

      await productModel.updateMany(
        { subcategoryId: { $in: subcategories.map((sub) => sub._id) } },
        { status: "Active" },
      );
    }
  }
  return res.status(200).json({ message: "success" });
};

export const deleteCategories = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryModel.findByIdAndDelete(categoryId);
  if (!category) {
    return next(new AppError(`categroy not found`, 404));
  }
  await cloudinary.uploader.destroy(category.image.public_id);
  await subcategoryModel.deleteMany({ categoryId });
  await productModel.deleteMany({ categoryId });
  return res.status(200).json({ message: "success" });
};
