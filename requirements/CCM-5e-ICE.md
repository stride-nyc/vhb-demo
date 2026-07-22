# CCM-5e-ICE – Comment Box for Coders

**Source:** Email from Brian Slattery (VHB) to Gopal Kamat (Stride), Jul 10, 2026  
**Project:** TSMIS (Traffic Safety Management Information System)  
**Intake ID:** #12 | **TAP ID:** CCM-5e

---

## Summary

A comment box was requested to support documentation during coding, training, and auditing. An editable comment box for crash records would help the team with internal identification purposes. When a note is added, the control should turn green to indicate that a note has been saved.

---

## Requirement

> The system must allow a user to enter a coding comment while coding, training, or auditing for future reference.

---

## Proposed TSMIS Design

### Interface

- Provide a **Comments** button to add, edit, or view coding comments in either the location coding or SOE coding workflows.
- Provide a running note that can be added to or replaced. No restriction on the user if they choose to overwrite previous notes.
  - Discussed with Caltrans CCU: a basic running note is preferred over a more robust note list.
  - A GUI control is needed for running comment additions and edits — possibly an Angular `TextArea`.
  - Allow any user able to enter the coding workflows to add, edit, or view comments. No restrictions in version 1.
- **Comments button — empty state:** Light grey background, black font. Font must be clearly black (not grey that could be confused with a disabled button).
- **Comments button — saved state:** Green background, black font.

### Workflow

1. **Step 1:** User clicks the Comments button to add, edit, or view a comment.  
   → A comments dialog box is presented for adding a new comment, editing existing comments, or viewing previously added comments.
2. **Step 2:** User enters a new comment.
3. **Step 3:** User clicks **Ok** to save, or **Cancel** to exit the dialog without saving.

### Data

- Add a `varchar(4000)` text field to the coding queue table (where other tracking fields like status and assignment are stored).
- The pre-existing `Comment` field in the `LocationCodingQueue` table is used by other workflows — add a new field named **`CodingComment`** dedicated to this specific workflow.

---

## Screenshots

See page images in this directory (`vhb_req_page-1.png` through `vhb_req_page-4.png`) for previous TSN system design reference and proposed TSMIS design mockups.
