import { roles } from "../../middleware/auth.js";

export const endPoint = {
  getAll: [roles.Admin],
  update: [roles.Admin],
  delete: [roles.Admin],
};

