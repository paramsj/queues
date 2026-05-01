import { Queue } from "bullmq";
import { redisConnection } from "../db/redis.js";

const queueName = process.env.BULLMQ_QUEUE_NAME || "jobs";

export const jobQueue = new Queue(queueName, {
  connection: redisConnection,
});

export const addJobToQueue = async ({
  jobId,
  userId,
  jobType,
  payload,
  priority,
}) => {
  const bullJob = await jobQueue.add(
    jobType,
    {
      jobId,
      userId,
      payload,
    },
    {
      jobId: jobId,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      priority: priority || 0,
      removeOnComplete: false,
      removeOnFail: false,
    }
  );

  return bullJob;
};