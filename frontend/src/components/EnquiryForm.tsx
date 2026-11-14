
import { useState } from "react";
import { api } from "../services/api";
import type { Product } from "../services/api";

interface EnquiryFormProps {
  product: Product;
  onCancel: () => void;
}

export default function EnquiryForm({
  product,
  onCancel
}: EnquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.submitEnquiry({
        productId: product.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim()
      });

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="enquiry-card" role="status">
        <h2>Thank you!</h2>
        <p>Your enquiry has been submitted successfully.</p>
        <p>
          Our sales team will review your enquiry about{" "}
          <strong>{product.title}</strong>.
        </p>
        <button type="button" onClick={onCancel}>
          Back to Product
        </button>
      </section>
    );
  }

  return (
    <section className="enquiry-card">
      <h2>Enquire About This Product</h2>
      <p>
        Product: <strong>{product.title}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="enquiry-name">Full Name *</label>
          <input
            id="enquiry-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="enquiry-email">Email *</label>
          <input
            id="enquiry-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-field">
          <label htmlFor="enquiry-phone">Phone</label>
          <input
            id="enquiry-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={30}
            autoComplete="tel"
          />
        </div>

        <div className="form-field">
          <label htmlFor="enquiry-message">Message</label>
          <textarea
            id="enquiry-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            rows={4}
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
