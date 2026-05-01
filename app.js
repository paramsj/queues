import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: '*'
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


import authRouter from './routes/auth.routes.js';
import jobRouter from './routes/job.routes.js';
import adminRouter from "./routes/admin.routes.js";

app.use("/api/v1/admin", adminRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobRouter);

export { app };