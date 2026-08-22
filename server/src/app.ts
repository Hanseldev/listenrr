import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import testRouter from "./routes/tests.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tests", testRouter);
app.use("/api", userRouter);
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

export default app;
