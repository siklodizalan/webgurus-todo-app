import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);
app.use("/", userRoutes);
app.use("/todos", todoRoutes);

export const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
