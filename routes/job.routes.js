import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createJob, getMyJobs, getJobById, streamJobProgress, streamAllJobsProgress } from "../controllers/job.controller.js";

const router = Router();

router.route('/').get(verifyJWT,getMyJobs);
router.route('/').post(verifyJWT,createJob);

router.route('/stream').get(verifyJWT, streamAllJobsProgress);
router.route('/:id').get(verifyJWT, getJobById);
router.route('/:id/stream').get(verifyJWT, streamJobProgress);

export default router;