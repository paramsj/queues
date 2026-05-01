import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createJob, getMyJobs, getJobById } from "../controllers/job.controller.js";

const router = Router();

router.route('/').get(verifyJWT,getMyJobs);
router.route('/').post(verifyJWT,createJob);

router.route('/:id').get(verifyJWT, getJobById);

export default router;