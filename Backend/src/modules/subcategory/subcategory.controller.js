import subcategoryModel from "../../../DB/model/subcategory.model.js";
import categoryModel from "../../../DB/model/category.model.js";
import productModel from "../../../DB/model/product.model.js";
import { createArabicSlug } from "../createSlug.js";
import mongoose from "mongoose";
import { AppError } from "../../utls/AppError.js";

export const createSubCategory = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  const { categoryId } = req.body;
  const subcategory = await subcategoryModel.findOne({ name });
  if (subcategory) {
    return next(new AppError(`subcategory ${name} already exists`, 409));
  }
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new AppError(`category not found`, 404));
  }

  const subCategory = await subcategoryModel.create({
    name,
    slug: createArabicSlug(name),
    categoryId,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  return res.status(201).json({ message: "success", subCategory });
};

export const getAllSubCategories = async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new AppError(`category not found`, 404));
  }
  const subcategory = await subcategoryModel.find({ categoryId: id }).populate({
    path: "categoryId",
  });

  return res
    .status(200)
    .json({ message: "success", count: subcategory.length, subcategory });
};

export const getAllSubWithOutCategory = async (req, res) => {
  const subcategories = await subcategoryModel.find({}).select("name");

  return res.status(200).json({
    message: "success",
    count: subcategories.length,
    subcategories,
  });
};

export const getActivesubCategory = async (req, res, next) => {
  const { id } = req.params;

  const subcategory = await subcategoryModel
    .find({ categoryId: id, status: "Active" })
    .select("name image slug")
    .populate({
      path: "categoryId",
    });

  if (!subcategory) {
    return next(new AppError(`subcategory not found`, 404));
  }
  return res.status(200).json({ message: "success", subcategory });
};

export const getDetailsubCategories = async (req, res, next) => {
  const subcategory = await subcategoryModel.findById(req.params.id);
  if (!subcategory) {
    return next(new AppError(`subcategory not found`, 404));
  }
  return res.status(200).json({ message: "success", subcategory });
};

export const updatesubCategories = async (req, res, next) => {
  const subcategoryId = new mongoose.Types.ObjectId(req.params.id);
  const subcategory = await subcategoryModel.findById(subcategoryId);
  if (!subcategory) {
    return next(new AppError(`Invalid subcategory id ${req.params.id}`, 404));
  }
  subcategory.name = req.body.name.toLowerCase();
  if (
    await subcategoryModel.findOne({
      name: req.body.name,
      _id: { $ne: subcategoryId },
    })
  ) {
    return next(
      new AppError(`Subcategory ${req.body.name} already exists`, 409),
    );
  }
  subcategory.slug = createArabicSlug(req.body.name);
  subcategory.status = req.body.status;
  subcategory.updatedBy = req.user._id;

  await subcategory.save();

  const products = await productModel.find({ subcategoryId: subcategoryId });
  if (products.length > 0) {
    if (req.body.status === "Inactive") {
      await productModel.updateMany(
        { subcategoryId: subcategoryId },
        { status: "Inactive" },
      );
    } else if (req.body.status === "Active") {
      await productModel.updateMany(
        { subcategoryId: subcategoryId },
        { status: "Active" },
      );
    }
  }

  return res.status(200).json({ message: "success" });
};

export const deletesubCategories = async (req, res, next) => {
  const { subcategoryId } = req.params;
  const subcategory = await subcategoryModel.findByIdAndDelete(subcategoryId);
  if (!subcategory) {
    return next(new AppError(`subcategory not found`, 404));
  }

  await productModel.deleteMany({ subcategoryId });

  return res.status(200).json({ message: "success" });
};

