import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";
import { AppError } from "../utls/AppError.js";

export const roles = {
  Admin: "Admin",
  User: "User",
};

export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARERKEY)) {
      return next(new AppError(`Invalid authorization`, 401));
    }
    const token = authorization.split(process.env.BEARERKEY)[1];
    try {
      const decoded = jwt.verify(token, process.env.LOGINSECRET);
      if (!decoded) {
        return next(new AppError(`Invalid authorization`, 401));
      }
      const user = await userModel
        .findById(decoded.id)
        .select("userName role changePasswordTime");
      if (!user) {
        return next(new AppError(`Not registered user`, 400));
      }
      if (parseInt(user.changePasswordTime?.getTime() / 1000) > decoded.iat) {
        return next(new AppError(`Expired token, please login`, 400));
      }
      if (!accessRoles.includes(user.role)) {
        return next(new AppError(`Not authorized user`, 401));
      }
      req.user = user;
      next();
    } catch (error) {
      return next(new AppError("Invalid token or token has expired", 400));
    }
  };
};

