import { asyncHandler } from "../utils/asyncHandler.js";
import { createJobService, getMyJobsService, getJobByIdService } from "../services/job.service.js";
import { supabase } from "../db/supabase.js";

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

export const streamJobProgress = asyncHandler(async (req, res) => {
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
      const job = await getJobByIdService(id, req.user.id);
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

export const streamAllJobsProgress = asyncHandler(async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const intervalId = setInterval(async () => {
    try {
      const jobs = await getMyJobsService(req.user.id, req.query);
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
