import { asyncHandler } from "../utils/asyncHandler.js";
import { createJobService, getMyJobsService, getJobByIdService } from "../services/job.service.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await createJobService(req.user.id, req.body);

  return res.status(201).json({
    success: true,
    message: "Job created successfully",
    data: job,
  });
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await getMyJobsService(req.user.id, req.query);

  return res.status(200).json({
    success: true,
    message: "Jobs fetched successfully",
    data: jobs,
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await getJobByIdService(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    message: "Job fetched successfully",
    data: job,
  });
});
