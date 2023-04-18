import request from "supertest";
require("chai").should();
import { app } from "../app";
import { Ticket } from "../models/Ticket";

const basicUrl = "/v1/tickets";

describe("get ticket", () => {
    let id: string;
    before(async () => {
      const p = await Ticket.create(ticket);
      id = p._id.toString();
    });
    after(async () => {
      await Ticket.findByIdAndDelete(id);
    });
    it("test success 200", async () => {
      const { status, body } = await request(app).get(`${basicUrl}/${id}`);
      status.should.be.equal(200);
      body.should.have.property("_id").equal(id);
      body.should.have.property("eventRelated").equal(ticket.eventRelated);
      body.should.have.property("price").equal(ticket.price);
    });
    it("test unsuccess 404 not valid mongoId", async () => {
      const fakeId = "a" + id.substring(1);
      const { status } = await request(app).get(`${basicUrl}/${fakeId}`);
      status.should.be.equal(404);
    });
  });