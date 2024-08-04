import app from "../app";
import request from "supertest";

describe("app", () => {
  let server;

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  test("should start the server and listen on the specified port", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
  });

  test("should return a 404 for non-existent routes", async () => {
    const response = await request(server).get("/non-existent");
    expect(response.status).toBe(404);
  });
});
