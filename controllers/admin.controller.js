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

export const streamJobByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const intervalId = setInterval(async () => {
    try {
      const job = await getJobByIdAdminService(id);
      sendEvent(job);

      if (
        job.status === "COMPLETED" ||
        job.status === "FAILED" ||
        job.status === "CANCELLED"
      ) {
        clearInterval(intervalId);
        res.end();
      }
    } catch (error) {
      clearInterval(intervalId);
      res.end();
    }
  }, 1000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

export const streamAllJobsAdmin = asyncHandler(async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const intervalId = setInterval(async () => {
    try {
      const jobs = await getAllJobsService(req.query);
      sendEvent(jobs);
    } catch (error) {
      clearInterval(intervalId);
      res.end();
    }
  }, 2000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
});