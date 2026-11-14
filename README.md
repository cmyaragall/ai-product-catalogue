# ShopExplore – AI-Native Product Catalogue PoC

A small, extensible product catalogue proof of concept built for the AI-Native Engineer code challenge.

## Technology choices

- **Frontend:** React, TypeScript, Vite and React Router
- **Backend:** Node.js, Express and TypeScript
- **Product data:** Fake Store API, accessed exclusively through the backend
- **Email:** Nodemailer with configurable SMTP
- **Local email testing:** Mailpit
- **Automated testing:** Vitest and Supertest

React and Node.js were selected to keep the application lightweight, provide TypeScript across both layers and support future extension.

## Features

- Home page displaying five top-rated featured products
- Category browsing with top-rated and additional products
- Product search by title or description
- Product details page
- Product enquiry form with validation
- Email notification to a configured sales inbox
- Thank-you message after successful submission
- Error handling for failed requests

## Architecture

```text
React + TypeScript frontend
          |
          | HTTP / JSON
          v
Node.js + Express backend
          |
          +---- Product service ---- Fake Store API
          |
          +---- Enquiry route
                     |
                     +---- Validation (Zod)
                     |
                     +---- Email service (Nodemailer)
                                   |
                                   v
                              SMTP / Mailpit
```

The frontend does not call Fake Store API directly. Product retrieval, ranking, searching and category grouping are handled by the backend.

## Prerequisites

- Node.js and npm
- Internet access for Fake Store API
- Mailpit for local enquiry-email testing

No paid services or accounts are required.

## Local setup

Clone the repository:

```bash
git clone https://github.com/cmyaragall/ai-product-catalogue.git
cd ai-product-catalogue
```

If reviewing the open pull request before it is merged, check out the feature branch:

```bash
git checkout feature/catalogue-mvp
```

### 1. Start Mailpit

Download the appropriate standalone executable from:

https://github.com/axllent/mailpit/releases/latest

Run Mailpit. Its default ports are:

- SMTP: `1025`
- Web inbox: `8025`

Open the inbox at http://localhost:8025.

### 2. Start the backend

```bash
cd backend
npm install
```

Create a `.env` file by copying `.env.example`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Start the backend:

```bash
npm run dev
```

Backend URL: http://localhost:3001

Health check: http://localhost:3001/api/health

### 3. Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Email configuration

The backend uses environment variables:

| Variable | Example | Purpose |
|---|---|---|
| PORT | 3001 | Backend port |
| SMTP_HOST | localhost | SMTP server |
| SMTP_PORT | 1025 | SMTP port |
| MAIL_FROM | catalogue@example.test | Sender |
| SALES_EMAIL | sales@example.test | Enquiry recipient |

Mailpit captures messages locally. It does not deliver them to a real external email inbox.

To test email delivery, open a product, select **Enquire Now**, complete the form and submit it. A successful submission displays a thank-you message. The captured email should appear in Mailpit at http://localhost:8025.

## Automated tests

From the `backend` folder:

```bash
npm test
```

The test suite contains 13 tests:

- 7 product service tests covering ranking, result limits, immutability and search
- 6 enquiry API tests covering success, validation, missing products and email failure handling

External product data and email dependencies are mocked in the automated enquiry API tests.

Manual end-to-end checks were also performed against the running frontend, backend and local Mailpit inbox.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products and optionally search |
| GET | `/api/products/featured` | Five featured products |
| GET | `/api/categories` | List categories |
| GET | `/api/categories/:category/products` | Products within a category |
| POST | `/api/enquiries` | Validate and submit an enquiry |

## Limitations

- Fake Store API is an external dependency and requires internet access.
- Product data is not stored locally.
- Local email testing uses Mailpit rather than a production email provider.
- The proof of concept does not include authentication, persistent enquiry storage or production deployment.
- The product catalogue uses a fixed demonstration data source.

## Additional documentation

See `DECISIONS.md` for assumptions, trade-offs and future improvements.

See `AI_USAGE.md` for AI-assisted development notes, human review and corrections.

## Time spent

See `DECISIONS.md` for the actual time breakdown.