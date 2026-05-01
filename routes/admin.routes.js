import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
  getAllJobs,
  getJobByIdAdmin,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/jobs", verifyJWT, verifyAdmin, getAllJobs);
router.get("/jobs/:id", verifyJWT, verifyAdmin, getJobByIdAdmin);

export default router;