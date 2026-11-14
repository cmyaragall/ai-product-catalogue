new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
}).format(product.price)

# Engineering Decisions and Assumptions

## 1. Objective

Build a functional product catalogue proof of concept that satisfies the acceptance criteria while keeping the architecture extensible.

The implementation prioritizes the core customer journey: browse products, search, view details and submit an enquiry.

## 2. Technology decisions

**React + TypeScript + Vite**

Chosen for a lightweight web client, fast local development and reusable components.

**Node.js + Express + TypeScript**

Chosen for a simple HTTP API, a shared language across frontend and backend and clear separation of responsibilities.

**Fake Store API**

Used as a temporary product data source to avoid building product administration or a database for the proof of concept.

**Nodemailer + SMTP**

Chosen to separate email delivery from the enquiry API. A different SMTP provider can be configured later.

**Mailpit**

Used for free local email testing without exposing personal credentials or requiring a paid service.

## 3. Assumptions

- **Featured products:** The five highest-rated products are selected using rating score, then rating count and product ID as tie-breakers.
- **Category ranking:** Products within a category are separated into top-rated and additional products.
- **Search:** Search matches product titles and descriptions, ignoring letter case.
- **Currency:** Product prices are displayed in USD, consistent with the assumed currency of the Fake Store API data.
- **Enquiry details:** Name and email are mandatory; phone and message are optional.
- **Enquiry confirmation:** The customer sees a thank-you message only after the backend successfully submits the email to the configured SMTP server.
- **Email recipient:** A configurable sales address is used instead of a hard-coded real inbox.

## 4. Architecture and extensibility

The implementation separates:

1. **Frontend presentation:** React components, pages and routing.
2. **Frontend API access:** A central service for backend requests.
3. **Backend HTTP routes:** Product, category and enquiry endpoints.
4. **Product service:** External product retrieval, ranking and search.
5. **Email service:** SMTP delivery independent of the enquiry route.

This separation makes it possible to replace the product source, update the frontend styling or change the email provider without rewriting the entire application.

## 5. Simplifications and trade-offs

**No database:** Product information is retrieved from Fake Store API. This reduces implementation time but introduces an external dependency.

**No authentication:** The catalogue and enquiry form are public for the proof of concept.

**No persistent enquiry storage:** Enquiries are sent through SMTP but are not saved to a database. Production delivery failures would require additional handling.

**Local SMTP testing:** Mailpit demonstrates email submission and capture, but does not represent production email delivery.

**Limited frontend automated testing:** Backend unit and API tests cover important business rules. Frontend behaviour was validated manually.

**No production infrastructure:** The proof of concept is designed to run locally. AWS deployment is deferred.

## 6. Security and reliability considerations

- Enquiry requests are validated on the backend using Zod.
- Product IDs are checked against the available catalogue.
- SMTP configuration is stored in environment variables.
- Local `.env` files are excluded from version control.
- Email delivery failures return an error rather than a misleading success response.
- The frontend prevents repeated submissions while a request is processing.

Production hardening would include rate limiting, spam protection, more restrictive CORS configuration, monitoring and appropriate data-retention controls.

## 7. What I would do with another day

1. Add automated frontend component and browser-level tests.
2. Introduce caching and resilience for the external product API.
3. Add persistent enquiry storage and reliable retry processing.
4. Introduce an interface or adapter for swapping product providers.
5. Add CI checks for linting, TypeScript compilation, tests and builds.
6. Improve accessibility, mobile responsiveness and error states.
7. Prepare AWS-compatible deployment configuration.

## 8. Actual Time Spent

**Total development time: 4 hours 15 minutes (255 minutes)**

| Activity | Time Spent |
|---|---|
| Planning and requirements analysis | 25 minutes |
| Environment setup and project scaffolding | 35 minutes |
| Backend development and API integration | 55 minutes |
| Frontend development | 50 minutes |
| Enquiry form and email integration | 35 minutes |
| Manual and automated testing | 35 minutes |
| Code review, documentation and Git preparation | 20 minutes |
| **Total** | **4 hours 15 minutes** |

I spent approximately 4 hours and 15 minutes completing the implementation, troubleshooting local setup and SMTP integration, validating the functionality, writing automated tests and preparing documentation.

I prioritized a working end-to-end solution, clear architectural separation and test coverage over additional features.