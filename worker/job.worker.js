import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { redisConnection } from "../db/redis.js";
import { supabase } from "../db/supabase.js";

const queueName = process.env.BULLMQ_QUEUE_NAME || "jobs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processJob = async (job) => {
  const { jobId, payload } = job.data;

  const startedAt = new Date();

  await supabase
    .from("jobs")
    .update({
      status: "PROCESSING",
      started_at: startedAt.toISOString(),
      progress: 10,
      attempts: job.attemptsMade + 1,
    })
    .eq("id", jobId);

  await job.updateProgress(30);

  // Simulated work
  await sleep(3000);

  await job.updateProgress(80);

  const result = {
    message: "Job processed successfully",
    receivedPayload: payload,
    processedAt: new Date().toISOString(),
  };

  const completedAt = new Date();
  const processingTimeMs = completedAt.getTime() - startedAt.getTime();

  await supabase
    .from("jobs")
    .update({
      status: "COMPLETED",
      result,
      progress: 100,
      completed_at: completedAt.toISOString(),
      processing_time_ms: processingTimeMs,
    })
    .eq("id", jobId);

  return result;
};

const worker = new Worker(queueName, processJob, {
  connection: redisConnection,
  concurrency: 5,
});

worker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

worker.on("failed", async (job, err) => {
  console.log(`Job failed: ${job?.id}`, err.message);

  if (!job?.data?.jobId) return;

  await supabase
    .from("jobs")
    .update({
      status: "FAILED",
      error_message: err.message,
      error_stack: err.stack,
      failed_at: new Date().toISOString(),
      attempts: job.attemptsMade,
    })
    .eq("id", job.data.jobId);
});

console.log(`Worker started for queue: ${queueName}`);

