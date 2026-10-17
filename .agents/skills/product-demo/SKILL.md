---
name: product-demo
description: Prepare and deliver product demos for the Teacher Training Tracker to client or internal audiences. Use for demo agendas, talk tracks, walkthroughs, and presentation materials grounded in this project.
metadata:
  short-description: Demo the Teacher Training Tracker
---

# Teacher Training Tracker Product Demo

Help the user give a clear, audience-focused demo of this repository's Teacher Training Tracker. Use the running product and its source as the evidence for every feature claim. Tailor the level of detail to the audience and available time.

## Learn the current product

Before preparing a demo, review `codebase/README.md`, the login and dashboard UI, and the relevant interactions in `codebase/assets/js`. Recheck these sources when the product changes. Do not rely on an old talk track for details that may have changed.

The current product is a responsive, role-based front-end prototype for KGBV digital classroom training. Its Admin, Trainer, and Trainee personas show programme operations, batch delivery, learning, progress, reporting, resources, and certificates. Use the README's local run instructions and demo persona information; do not copy credentials into client-facing materials.

## Shape the walkthrough

Identify the audience's main question and the time available. If the user has not specified them, make a useful default: a concise 10–15 minute walkthrough, with separate emphasis for client and internal audiences.

- **Client or partner:** Lead with the training lifecycle and the operational visibility the tracker provides. Show how programme setup relates to training plans and batches, then how trainers record delivery and trainees follow learning and completion. Keep implementation detail brief.
- **Internal team:** Show the same user journey, then spend more time on role boundaries, sample data, interaction behavior, known limitations, open product decisions, and feedback needed from the team.

Use a simple arc: the operational need, the relevant role's workflow, the progress or completion view, and a question that invites useful feedback. Prefer a few connected screens over a catalogue of every page.

## Set up and present the live demo

Follow `codebase/README.md`: start the local server from `codebase` with `npm run start`, open `http://127.0.0.1:4173`, choose a persona, and continue to its dashboard. Keep the server running. Confirm the selected persona and starting page before presenting. The session expires after 30 minutes.

Choose only the pages that serve the demo goal. Useful paths in the current UI include:

- **Admin:** Admin dashboard → Project or Training plans → Batch upload or Trainers & availability → a relevant report. Use state and “Data as of” controls to explain how the overview can be filtered or viewed at a sample date; identify those values as demo scenarios.
- **Trainer:** My work → Participants & registration → Mark attendance or Training plan → Content library. Explain how the trainer sees their assigned work and the tools for delivering a session.
- **Trainee:** My training → Assessment or Feedback → Certificates → Learning resources. Show how the learner follows training and related resources.

KPI cards and report links drill into supporting views. Use one purposeful drill-down when it helps answer the audience's question, then return to the main story. If an interaction or page behaves differently from this outline, follow the current UI and update the talk track instead of improvising a feature claim.

## Keep claims accurate

This repository describes a **client-side demo with sample data**. Interactions use browser-side demo state; the demo persona session is not production authentication. The README identifies production authentication, role enforcement, and tenant isolation as backend requirements. Explain these limits when discussing deployment, security, integrations, persistence, or readiness for real operations.

Do not present sample counts, names, dates, attendance, assessments, completion, audit entries, or certificates as live client or programme records. The dashboard's “Data as of” options are sample dates, and the app's reference date is defined in its source. Avoid promises about integrations, backend persistence, automated delivery, or access controls unless verified in the current code or deployment.

Do not enter real trainee or client information during a demo. The app notes that changes are saved in the browser, and form submissions may be browser-local. Prefer a clean demo session and sample records. Sign out when finished; the session expires automatically after 30 minutes.

## Close and capture feedback

End by restating the workflow shown and asking one or two questions tied to the audience's role, such as which operational decision the overview should support or which trainer/trainee step needs clarification. For internal reviews, record confirmed issues separately from ideas and unanswered policy decisions. Do not invent programme rules, certificate eligibility, or delivery commitments to make the demo feel complete.

When asked for a script, agenda, or slides, produce a client-ready artifact grounded in the current UI, with an explicit note where a statement describes a prototype limitation or a proposed future capability.
