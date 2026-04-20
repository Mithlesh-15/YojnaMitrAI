import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import schemesRoutes from "./routes/schemesRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://yojnamitrai.netlify.app",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/schemes", schemesRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
