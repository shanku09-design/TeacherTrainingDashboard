---
name: teacher-training-dashboard
description: Build and improve this teacher training dashboard, including trainer and trainee batch workflows, day-wise training activities, forms, progress tracking, and completion certificates. Use for feature work tied to the training lifecycle in this repository.
---

# Teacher Training Dashboard

Use this skill for changes to the dashboard's training lifecycle, from setting up a program through recording activities and issuing completion certificates.

## Project context

The repository README describes a dashboard for training programs with trainers, trainee batches, forms, day-wise activities, and certificates. Treat this as a starting point, not a complete specification. Inspect the current code, data model, UI patterns, and project instructions before changing behavior. Preserve established conventions and avoid assuming a framework or data source that is not present.

## Work across the lifecycle

- **Dashboard features:** Clarify the user and workflow the feature supports, then implement it consistently with existing navigation, components, validation, and data handling. Consider trainer, trainee, and program administrator needs when the affected workflow involves them.
- **Training activities:** Keep activities associated with the right program, batch, and training day. Support the existing forms and activity-recording patterns; surface completion or missing information where it helps users continue the program.
- **Progress and certificates:** Derive completion status from recorded program requirements. Use eligibility rules and certificate details defined by the project or user. Do not invent attendance thresholds, required activities, approval steps, certificate wording, or personal data fields. If an essential rule is missing, ask for it while completing independent implementation work where possible.

## Implementation guidance

1. Trace the relevant workflow through UI, state/data model, persistence, and existing validation before editing.
2. Keep related records connected to their program and batch; follow current identifiers and relationship patterns.
3. Make incomplete, invalid, or not-yet-eligible states clear. Prevent duplicate or premature certificate issuance when the existing architecture supports that check.
4. Respect the repository's existing authorization and privacy boundaries. Do not expose trainee information beyond the intended audience.
5. Keep changes scoped to the requested feature. Update directly relevant documentation when behavior or setup changes.
6. Do not claim completion or certification until the recorded requirements and any required approvals are satisfied.

## Validation

Follow the repository's existing validation approach and the user's requested scope. When asked to verify a change, run the relevant checks and report their results. If the repository does not yet define a testing or validation convention, state what was inspected and what could not be verified.
