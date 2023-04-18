import request from "supertest";
require("chai").should();
import { app } from "../app";
import { Ticket } from "../models/Ticket";
import { Event } from "../models/Event";

const basicUrl = "/v1/events";

describe.only("events", () => {
  const event = {
    title: "Fiera esempio Uno",
    date: 28/4/2023,
    city: "Catania",
    address: "Via Esempio",
    eventType: "Cibo",
    availability: 300,
  };
  const ticket = {
    eventRelated: "Fiera del carciofo",
    price: 40,
  };
  before(async () => {
    const eventCreated = new Event({
      title: event.title,
      date: event.date,
      city: event.city,
      address: event.address,
      eventType: event.eventType,
      availability: event.availability,
    });
    await eventCreated.save();
  });
  after(async () => {
    await Event.findOneAndDelete({ title: event.title });
  });

  describe("update event", () => {
    let id: string;
    before(async () => {
      const p = await Event.create(event);
      id = p._id.toString();
    });
    after(async () => {
      await Event.findByIdAndDelete(id);
    });
    it("test failed 401", async () => {
      const { status } = await request(app)
        .put(`${basicUrl}/${id}`)
        .send({ ...event });
      status.should.be.equal(401);
    });
    it("test success 200", async () => {
      const { status, body } = await request(app)
        .put(`${basicUrl}/${id}`)
        .send({ ...event });
      status.should.be.equal(200);
      body.should.have.property("_id");
      body.should.have.property("title").equal(event.title);
      body.should.have.property("city").equal(event.city);
    });

    it("test unsuccess 404 not valid mongoId", async () => {
      const fakeId = "a" + id.substring(1);
      const { status } = await request(app)
        .put(`${basicUrl}/${fakeId}`)
        .send({ ...event });
      status.should.be.equal(404);
    });

    it("test unsuccess 400 missing brand", async () => {
      const fakeProduct = { ...event } as any;
      const { status } = await request(app)
        .put(`${basicUrl}/${id}`);
      status.should.be.equal(400);
    });

    it("test unsuccess 400 price not number", async () => {
      const fakeEvent = { ...event } as any;
      fakeEvent.title = 30;
      const { status } = await request(app)
        .put(`${basicUrl}/${id}`);
      status.should.be.equal(400);
    });
  });

  describe("delete product", () => {
    let id: string;
    before(async () => {
      const p = await Event.create(event);
      id = p._id.toString();
    });
    it("test failed 401", async () => {
      const { status } = await request(app).delete(`${basicUrl}/${id}`);
      status.should.be.equal(401);
    });
    it("test success 200", async () => {
      const { status } = await request(app)
        .delete(`${basicUrl}/${id}`);
      status.should.be.equal(200);
    });
  });

  describe("get event", () => {
    let id: string;
    before(async () => {
      const p = await Event.create(event);
      id = p._id.toString();
    });
    after(async () => {
      await Event.findByIdAndDelete(id);
    });
    it("test success 200", async () => {
      const { status, body } = await request(app).get(`${basicUrl}/${id}`);
      status.should.be.equal(200);
      body.should.have.property("_id").equal(id);
    });
    it("test unsuccess 404 not valid mongoId", async () => {
      const fakeId = "a" + id.substring(1);
      const { status } = await request(app).get(`${basicUrl}/${fakeId}`);
      status.should.be.equal(404);
    });
  });

  describe("get events", () => {
    let ids: string[] = [];
    const events = [
      {
        title: "Fiera del test 1",
        date: 10/2/2023,
        city: "Catania",
        address: "Via Esempio 1",
        eventType: "Cibo",
        availability: 300,
      },
      {
        title: "Fiera del test 2",
        date: 13/8/2025,
        city: "Bologna",
        address: "Via Esempio 2",
        eventType: "Hobby",
        availability: 100,
      },
      {
        title: "Fiera del test 3",
        date: 13/8/2025,
        city: "Torino",
        address: "Via Esempio 3",
        eventType: "Sport",
        availability: 700,
      },
    ];
    before(async () => {
      const response = await Promise.all([
        Event.create(events[0]),
        Event.create(events[1]),
        Event.create(events[2]),
      ]);
      ids = response.map((item) => item._id.toString());
    });
    after(async () => {
      await Promise.all([
        Event.findByIdAndDelete(ids[0]),
        Event.findByIdAndDelete(ids[1]),
        Event.findByIdAndDelete(ids[2]),
      ]);
    });

    it("test success 200", async () => {
      const { status, body } = await request(app).get(basicUrl);
      status.should.be.equal(200);
      body.should.have.property("length").equal(events.length);
    });

    it("test success 200 with query params", async () => {
      const { status, body } = await request(app).get(
        `${basicUrl}?brand=apple`
      );
      status.should.be.equal(200);
      body.should.have.property("length").equal(1);
    });
  });
});