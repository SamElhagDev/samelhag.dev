# Feature Specification: Contact Page Email Send

**Feature Branch**: `004-contact-email-send`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Finish the contact page, I need to get that email send working."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Sends a Contact Message (Priority: P1)

A visitor navigates to the contact page, fills out the form (first name, last name, email, subject, message), and clicks "Send Message." The system delivers the message to Sam's inbox as an email so he can read and respond.

**Why this priority**: This is the entire purpose of the contact page. Without actual email delivery, the form is non-functional — visitors believe their message was sent but nothing happens.

**Independent Test**: Can be fully tested by submitting the form and verifying an email arrives at Sam's inbox with the correct sender details, subject, and message body.

**Acceptance Scenarios**:

1. **Given** a visitor is on the contact page with all fields filled in validly, **When** they click "Send Message," **Then** an email is delivered to Sam's configured inbox containing the visitor's name, email, subject, and message.
2. **Given** a visitor submits the form successfully, **When** the email is delivered, **Then** the visitor sees a success notification and the form resets to empty.
3. **Given** a visitor submits the form but the email service is temporarily unavailable, **When** the send fails, **Then** the visitor sees a clear error message asking them to try again later.

---

### User Story 2 - Visitor Receives Clear Feedback During Submission (Priority: P2)

After clicking "Send Message," the visitor sees a loading state on the button ("Sending…") while the system processes the request. Once complete, they receive a clear success or error notification.

**Why this priority**: Good user experience builds trust. Without clear feedback, visitors may re-submit or leave unsure if their message went through.

**Independent Test**: Can be tested by submitting the form and observing the button state change and the success/error notification appearing afterward.

**Acceptance Scenarios**:

1. **Given** a visitor clicks "Send Message," **When** the system is processing the request, **Then** the button shows "Sending…" and is disabled to prevent double submission.
2. **Given** the email is sent successfully, **When** the system confirms delivery, **Then** a success notification appears and the form fields are cleared.
3. **Given** the email fails to send, **When** the system receives an error, **Then** an error notification appears without exposing technical details, and the form retains the visitor's input so they can retry.

---

### User Story 3 - Sam Receives a Well-Formatted, Replyable Email (Priority: P2)

When Sam receives the contact form email in his inbox, it is clearly formatted with the visitor's name, email, subject, and message. Sam can hit "Reply" and it goes directly to the visitor.

**Why this priority**: A readable email with correct reply-to saves Sam time and ensures he can respond directly without copy-pasting addresses.

**Independent Test**: Can be tested by submitting the form, inspecting the received email for formatting, and verifying that replying goes to the visitor's email.

**Acceptance Scenarios**:

1. **Given** a visitor submits the form, **When** Sam receives the email, **Then** the email includes the visitor's full name, their email as the reply-to address, the subject line from the form, and the full message body.
2. **Given** Sam receives a contact email, **When** he clicks "Reply," **Then** the reply is addressed to the visitor's email address (not the system sender).

---

### Edge Cases

- What happens when the visitor enters a very long message (e.g., 10,000+ characters)?
- What happens when the email service credentials are misconfigured or expired?
- What happens if a visitor submits the form multiple times in quick succession before the first request completes?
- What happens when the visitor's email address is technically valid but doesn't exist (e.g., typo)?
- What happens if the server is restarted mid-submission?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST send an email to Sam's configured recipient address when a visitor submits the contact form with valid data.
- **FR-002**: System MUST include the visitor's first name, last name, email address, subject, and message in the delivered email.
- **FR-003**: System MUST set the visitor's email as the reply-to address on the outgoing email so Sam can reply directly.
- **FR-004**: System MUST display a success notification to the visitor after the email is sent successfully and reset the form.
- **FR-005**: System MUST display an error notification if the email fails to send, without exposing technical details to the visitor.
- **FR-006**: System MUST prevent duplicate submissions by disabling the send button while a submission is in progress.
- **FR-007**: System MUST store email service configuration (credentials, recipient address) outside of source code via application configuration.
- **FR-008**: System MUST validate all form fields before attempting to send (first name, last name, valid email, subject, message — all required).

### Key Entities

- **Contact Message**: Represents a visitor's submission — contains first name, last name, sender email, subject, and message body. Delivered as an email; not persisted in a database.
- **Email Configuration**: The service credentials and recipient address needed to send emails. Stored in application configuration, not in code.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can complete and submit the contact form, and an email arrives in Sam's inbox within 30 seconds.
- **SC-002**: 100% of successfully submitted forms result in a delivered email (excluding external email service outages).
- **SC-003**: The visitor sees clear success or failure feedback within 5 seconds of clicking "Send Message."
- **SC-004**: Sam can reply directly to the contact email and the reply goes to the visitor's email address.
- **SC-005**: No email service credentials or secrets are committed to source control.

## Assumptions

- The existing contact form UI (fields, layout, validation, styling) is complete and does not need changes — only the backend email-sending logic needs to be implemented.
- Sam's personal email (sami.eltaj.elhag@gmail.com, as shown on the contact page) is the intended recipient for contact form submissions.
- A standard email delivery service or SMTP provider will be used — the specific provider will be determined during planning.
- Contact messages do not need to be stored in a database; email delivery is sufficient.
- Rate limiting and spam prevention (e.g., CAPTCHA) are out of scope for this feature but may be added later.
- The site is a Blazor Server application, so the email send will happen server-side — no client-side API calls or exposed credentials.
