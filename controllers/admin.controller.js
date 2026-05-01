import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAllJobsService,
  getJobByIdAdminService,
} from "../services/admin.service.js";

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await getAllJobsService(req.query);

  return res.status(200).json({
    success: true,
    message: "All jobs fetched",
    data: jobs,
  });
});

export const getJobByIdAdmin = asyncHandler(async (req, res) => {
  const job = await getJobByIdAdminService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Job fetched",
    data: job,
  });
});