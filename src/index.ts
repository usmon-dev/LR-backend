import express from "express";
import cors from "cors";
import "dotenv/config";
import { apiKeyMiddleware } from "./middleware/middleware";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", apiKeyMiddleware, (req, res) => {
  res.send("Hello! This is LR API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
