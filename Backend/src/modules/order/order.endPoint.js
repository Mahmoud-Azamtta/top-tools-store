import { roles } from "../../middleware/auth.js";

export const endPoint = {
  create: [roles.User],
  get: [roles.Admin, roles.User],
  all: [roles.Admin],
  changeStatus: [roles.Admin],
  delete: [roles.Admin, roles.User],
  update: [roles.Admin],
  confirm: [roles.User],
  delete: [roles.User],
};

