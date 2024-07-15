import { roles } from "../../middleware/auth.js";

export const endPoint = {
  get: [roles.User],
  Update: [roles.User],
};

