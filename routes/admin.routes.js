import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
  getAllJobs,
  getJobByIdAdmin,
  streamJobByIdAdmin,
  streamAllJobsAdmin,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/jobs", verifyJWT, verifyAdmin, getAllJobs);
router.get("/jobs/stream", verifyJWT, verifyAdmin, streamAllJobsAdmin);
router.get("/jobs/:id", verifyJWT, verifyAdmin, getJobByIdAdmin);
router.get("/jobs/:id/stream", verifyJWT, verifyAdmin, streamJobByIdAdmin);

export default router;