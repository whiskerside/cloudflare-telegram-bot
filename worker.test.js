const { describe, expect, it, beforeAll, afterAll } = require("@jest/globals");

describe("Worker", () => {
  let worker;

  beforeAll(async () => {
    worker = global.mf;
  });

  it("should return 405 for non-POST requests", async () => {
    const resp = await worker.dispatchFetch("http://localhost/", {
      method: "GET",
    });
    expect(resp.status).toBe(405);
  });

  it("should return 401 for invalid token", async () => {
    const resp = await worker.dispatchFetch("http://localhost/?token=invalid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: 200, message: "Test" }),
    });
    expect(resp.status).toBe(401);
  });

  it("should return 400 for invalid payload", async () => {
    const resp = await worker.dispatchFetch(
      "http://localhost/?token=valid_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "invalid", message: "Test" }),
      }
    );
    expect(resp.status).toBe(400);
    const body = await resp.text();
    expect(body).toContain("Invalid code parameter");
  });

  it("should return 200 for valid request", async () => {
    const resp = await worker.dispatchFetch(
      "http://localhost/?token=valid_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: 200,
          message: "Test message",
          details: { test: "data" },
        }),
      }
    );
    expect(resp.status).toBe(200);
  });
});

// Mock fetch function
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     ok: true,
//     json: () => Promise.resolve({ result: "success" }),
//   })
// );
global.fetch = jest.fn((url) => {
  if (url.includes("api.telegram.org")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ result: "success" }),
    });
  }
  // 为其他请求返回默认响应
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});
