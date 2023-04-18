import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: Date,
  city: { type: String, required: true },
  address: { type: String, required: true },
  eventType: { type: String, required: true },
  availability: { type: Number, required: true },
});

export const Event = mongoose.model("Event", EventSchema);