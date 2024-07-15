import mongoose, { Schema, model, Types } from "mongoose";

const variantSchema = new Schema(
  {
    itemNo: {
      type: String,
      unique: true,
      required: true,
    },
    inStoke: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
    },
    attributes: {
      type: Map,
      of: String,
    },
  },
  {
    _id: false,
  },
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    specifications: {
      type: String,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    special: {
      type: Boolean,
      default: false,
    },
    del: {
      type: Boolean,
      default: false,
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    minDiscount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    numOfOrders: {
      type: Number,
      default: 0,
    },
    variants: [variantSchema],
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    subcategoryId: { type: Types.ObjectId, ref: "Subcategory", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
productSchema.virtual("reviews", {
  localField: "_id",
  foreignField: "productId",
  ref: "Review",
});
const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel;
