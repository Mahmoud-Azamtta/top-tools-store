import { roles } from "../../middleware/auth.js";

export const endPoint = {
  create: [roles.Admin],
  getAll: [roles.Admin, roles.User],
  get: [roles.Admin],
  update: [roles.Admin],
  delete: [roles.Admin],
  changeStatus: [roles.Admin],
  getRecommended: [roles.User],
};
