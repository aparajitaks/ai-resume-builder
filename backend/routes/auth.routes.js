import express from "express";
import validate from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../validators/auth.validator.js";
import {
  registerUser,
  loginUser,
  refreshTokenController,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", validate(refreshSchema), refreshTokenController);
router.post("/logout", logoutUser);

export default router;
