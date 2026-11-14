# AI Usage Notes

## 1. AI tools used

**ChatGPT (OpenAI)**

Used to interpret requirements, plan implementation steps, generate code suggestions, troubleshoot issues, design test cases and draft documentation.

**Other AI tools**

[Confirm whether any additional AI tool generated or modified project code. Do not list tools that were only installed or explored as if they were used for implementation.]

## 2. Development approach

The project was developed through an iterative, human-directed workflow:

1. Interpret the acceptance criteria.
2. Choose a minimal architecture.
3. Generate and review one implementation step at a time.
4. Run the application locally.
5. Test the expected behaviour.
6. Investigate and correct failures.
7. Add automated tests.
8. Review the solution and document trade-offs.

AI suggestions were not treated as automatically correct. Implementation steps were checked through local execution, API requests, browser testing and automated tests.

## 3. Key AI prompts and moments

The following are representative summaries of the prompts and interactions that shaped the solution.

### Prompt 1 – Architecture and planning

"Guide me step by step through building an AI-Native Engineer product catalogue assignment using React, TypeScript and Node.js, with a structure that can grow beyond the proof of concept."

**Outcome:** Established separate frontend and backend applications and a product service for Fake Store API access.

### Prompt 2 – Product catalogue implementation

"Help me implement featured products, category browsing, product search and product details while keeping Fake Store API access in the backend."

**Outcome:** Implemented product retrieval, ranking, category grouping and search through backend endpoints.

### Prompt 3 – Enquiry and email functionality

"Guide me through implementing an enquiry form and email functionality, including local testing without Docker or paid services."

**Outcome:** Added backend validation, a separate email service, React enquiry form and Mailpit-based email testing.

### Prompt 4 – Automated testing

"Guide me through automated product service and enquiry API tests using Vitest and Supertest."

**Outcome:** Implemented 13 automated tests covering business rules, validation, successful submissions and failure handling.

### Prompt 5 – Submission preparation

"Guide me through README, engineering decisions, AI usage notes, actual time documentation and the GitHub pull request."

**Outcome:** Prepared submission documentation and a final verification process.

## 4. Where AI guidance required correction

### Issue 1 – Email testing dependency

**What happened:** Initial API testing was attempted before the local Mailpit SMTP server was installed and running.

**How it was detected:** The enquiry endpoint returned an error, and the Mailpit browser address refused the connection.

**Correction:** Installed and started standalone Mailpit on Windows, then repeated the API and email verification.

**Lesson:** Validate external dependencies and setup prerequisites before testing an integration.

### Issue 2 – Frontend code integration

**What happened:** Adding enquiry state before connecting the button resulted in an unused-variable warning.

**How it was detected:** VS Code highlighted the declared state variables.

**Correction:** Connected the state to the Enquire Now button and enquiry form component.

**Lesson:** Review AI-generated snippets in their full component context rather than assuming isolated snippets are complete.

### Issue 3 – Testability of server startup

**What happened:** The original backend application started listening immediately, making isolated HTTP API tests less convenient.

**How it was detected:** During planning for Supertest API tests.

**Correction:** Separated Express application construction (`app.ts`) from server startup (`server.ts`).

**Lesson:** Separating application setup from process startup improves testability and maintainability.

## 5. Validation and ownership

The solution was checked using:

- Manual browser acceptance testing
- Postman API testing
- Mailpit email inspection
- Seven automated product service tests
- Six automated enquiry API tests
- TypeScript and build checks during final verification

The developer remains responsible for reviewing, understanding and explaining the final code and design decisions.

## 6. Agent instruction files

No repository-level AI agent instruction file was used unless one is added and committed before submission.

The implementation relied on interactive prompts and step-by-step review rather than an autonomous coding agent.

## 7. Known limitations of AI assistance

AI-generated code can contain incorrect assumptions, integration mistakes or incomplete setup instructions. Local execution and tests were used to detect problems, but passing tests do not guarantee production readiness.