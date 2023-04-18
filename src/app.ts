import express, { NextFunction, Response, Request } from "express";
export const app = express();
import mongoose from "mongoose";
import events from "./routes/events";
import tickets from "./routes/tickets";

app.use(express.json());

app.use("/v1/events", events);
app.use("/v1/tickets", tickets);

app.listen(process.env.PORT || 3001, async () => {
  console.log("Server is running");
  await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB}`);
});

export default app;