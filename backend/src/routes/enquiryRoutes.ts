
import { Router } from "express";
import { z } from "zod";
import { getProducts } from "../services/productService";
import { sendEnquiryEmail } from "../email/emailService";

const router = Router();

const enquirySchema = z.object({
  productId: z.number().int().positive(),
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(2000).optional()
});

router.post("/", async (req, res) => {
  const result = enquirySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid enquiry details",
      details: result.error.flatten()
    });
  }

  try {
    const products = await getProducts();
    const product = products.find(
      p => p.id === result.data.productId
    );

    if (!product) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    await sendEnquiryEmail({
      ...result.data,
      productTitle: product.title
    });

    return res.status(201).json({
      message: "Thank you! Your enquiry has been submitted."
    });
  } catch (error) {
    console.error("Enquiry submission failed:", error);

    return res.status(502).json({
      error: "Unable to submit enquiry. Please try again."
    });
  }
});

export default router;
