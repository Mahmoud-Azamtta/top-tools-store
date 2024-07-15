import { roles } from "../../middleware/auth.js";

export const endpoints = {
  create: [roles.User],
  delete: [roles.User],
  clear: [roles.User],
  get: [roles.User],
  update: [roles.User],
};

