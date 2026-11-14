
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../src/app";
import { getProducts } from "../src/services/productService";
import { sendEnquiryEmail } from "../src/email/emailService";

vi.mock("../src/services/productService", () => ({
  getProducts: vi.fn()
}));

vi.mock("../src/email/emailService", () => ({
  sendEnquiryEmail: vi.fn()
}));

const sampleProduct = {
  id: 1,
  title: "Test Backpack",
  price: 50,
  description: "A useful travel backpack",
  category: "bags",
  image: "backpack.jpg",
  rating: { rate: 4.8, count: 100 }
};

const validEnquiry = {
  productId: 1,
  name: "Test Customer",
  email: "customer@example.com",
  phone: "9876543210",
  message: "I am interested in this product."
};

describe("POST /api/enquiries", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(getProducts).mockResolvedValue([sampleProduct]);
    vi.mocked(sendEnquiryEmail).mockResolvedValue(undefined);
  });

  it("returns 201 and sends an email for a valid enquiry", async () => {
    const response = await request(app)
      .post("/api/enquiries")
      .send(validEnquiry);

    expect(response.status).toBe(201);
    expect(response.body.message).toContain("Thank you");

    expect(sendEnquiryEmail).toHaveBeenCalledWith({
      ...validEnquiry,
      productTitle: "Test Backpack"
    });
  });

  it("returns 400 when the customer name is missing", async () => {
    const response = await request(app)
      .post("/api/enquiries")
      .send({
        ...validEnquiry,
        name: ""
      });

    expect(response.status).toBe(400);
    expect(sendEnquiryEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid email address", async () => {
    const response = await request(app)
      .post("/api/enquiries")
      .send({
        ...validEnquiry,
        email: "invalid-email"
      });

    expect(response.status).toBe(400);
    expect(sendEnquiryEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid product ID", async () => {
    const response = await request(app)
      .post("/api/enquiries")
      .send({
        ...validEnquiry,
        productId: "not-a-number"
      });

    expect(response.status).toBe(400);
    expect(sendEnquiryEmail).not.toHaveBeenCalled();
  });

  it("returns 404 when the product does not exist", async () => {
    const response = await request(app)
      .post("/api/enquiries")
      .send({
        ...validEnquiry,
        productId: 999
      });

    expect(response.status).toBe(404);
    expect(sendEnquiryEmail).not.toHaveBeenCalled();
  });

  it("returns 502 when email delivery fails", async () => {
    vi.mocked(sendEnquiryEmail).mockRejectedValue(
      new Error("SMTP server unavailable")
    );

    const response = await request(app)
      .post("/api/enquiries")
      .send(validEnquiry);

    expect(response.status).toBe(502);
    expect(response.body.error).toContain("Unable to submit enquiry");
  });
});
