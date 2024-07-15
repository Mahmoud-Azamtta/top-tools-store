import mongoose, { Schema, model } from "mongoose";

export const addressSchema = new Schema(
  {
    city: { type: String, required: false },
    street: { type: String, required: false },
    description: { type: String },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    Address: addressSchema,

    confirmEmail: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    sendCode: {
      type: String,
      default: null,
    },
    changePasswordTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("orders", {
  localField: "_id",
  foreignField: "userId",
  ref: "Order",
});

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
