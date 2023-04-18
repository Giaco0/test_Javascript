import express from "express";
import { body, header, param, query } from "express-validator";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get("events/:id/tickets", param("id").isMongoId(), async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return res.status(404).json({ message: "ticket not found" });
  }
  res.json(ticket);
});

router.post(
  "/events/:id/tickets",
  body("eventRelated").exists().isString(),
  body("price").exists().isNumeric(),
  async (req, res) => {
    const { price } = req.body;
    const ticket = new Ticket({ price });
    const ticketSaved = await ticket.save();
    res.status(201).json(ticketSaved);
  }
);

export default router;