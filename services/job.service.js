import { supabase } from "../db/supabase.js";
import { ApiError } from "../utils/ApiError.js";
import { addJobToQueue } from "./queue.service.js";

export const createJobService = async (userId, body) => {
  const { job_type, payload, priority = 0 } = body;

  if (!job_type || !payload) {
    throw new ApiError(400, "job_type and payload are required");
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .insert([
      {
        user_id: userId,
        job_type,
        payload,
        priority,
        status: "PENDING",
        progress: 0,
      },
    ])
    .select("*")
    .single();

  if (error) {
    throw new ApiError(500, error.message);
  }

try {
    const bullJob = await addJobToQueue({
      jobId: job.id,
      userId,
      jobType: job_type,
      payload,
      priority,
    });

    const { data: updatedJob, error: updateError } = await supabase
      .from("jobs")
      .update({
        bull_job_id: bullJob.id,
        status: "QUEUED",
        queued_at: new Date().toISOString(),
      })
      .eq("id", job.id)
      .select("*")
      .single();

    if (updateError) {
      throw new ApiError(500, updateError.message);
    }

    return updatedJob;
  } catch (queueError) {
    await supabase
      .from("jobs")
      .update({
        status: "FAILED",
        error_message: queueError.message,
        failed_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    throw new ApiError(500, "Job created in DB but failed to push to queue");
  }
};

export const getMyJobsService = async (userId, query) => {
  const { status } = query;

  let request = supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (status) {
    request = request.eq("status", status);
  }

  const { data: jobs, error } = await request;

  if (error) {
    throw new ApiError(500, error.message);
  }

  return jobs;
};

export const getJobByIdService = async (jobId, userId) => {
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new ApiError(404, "Job not found");
  }

  return job;
};