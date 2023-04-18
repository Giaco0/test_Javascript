import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  eventRelated: { type: String, required: true },
  price: { type: Number, required: true },
});

export const Ticket = mongoose.model("Ticket", TicketSchema);