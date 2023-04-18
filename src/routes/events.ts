import express from "express";
import { body, header, param, query } from "express-validator";
import { Event } from "../models/Event";

const router = express.Router();

router.get(
  "/",
  query("title").optional().isString(),
  query("date").optional().isDate(),
  query("city").optional().isString(),
  query("address").optional().isString(),
  query("eventType").optional().isString(),
  query("availability").optional().isNumeric(),
  async (req, res) => {
    const events = await Event.find({ ...req.query });
    res.json(events);
  }
);

router.get("/:id", param("id").isMongoId(), async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ message: "event not found" });
  }
  res.json(event);
});

router.put(
  "/:id",
  param("id").isMongoId(),
  query("title").optional().isString(),
  query("date").optional().isDate(),
  query("city").optional().isString(),
  query("address").optional().isString(),
  query("eventType").optional().isString(),
  query("availability").optional().isNumeric(),
  async (req, res) => {
    const { id } = req.params;
    const { title, date } = req.body;
    try {
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ message: "event not found" });
      }
      event.title = title;
      event.date = date;
      const eventSaved = await event.save();
      res.json(eventSaved);
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

router.delete(
  "/:id",
  param("id").isMongoId(),
  async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    await Event.findByIdAndDelete(id);
    res.json({ message: "event deleted" });
  }
);

export default router;
