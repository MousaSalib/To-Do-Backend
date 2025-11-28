import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import userProfileRoutes from "./routes/userProfileRoutes";
import adminRoutes from "./routes/adminRoutes";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to the API!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
