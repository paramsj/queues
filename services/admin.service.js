import { supabase } from "../db/supabase.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllJobsService = async (query) => {
  const { status, user_id, job_type } = query;

  let request = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    request = request.eq("status", status);
  }

  if (user_id) {
    request = request.eq("user_id", user_id);
  }

  if (job_type) {
    request = request.eq("job_type", job_type);
  }

  const { data, error } = await request;

  if (error) {
    throw new ApiError(500, error.message);
  }

  return data;
};

export const getJobByIdAdminService = async (jobId) => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !data) {
    throw new ApiError(404, "Job not found");
  }

  return data;
};