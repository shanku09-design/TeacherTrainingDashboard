# Teacher Training Dashboard Codex agents

These project-scoped Codex custom agents mirror the role profiles in `.github/agents/`. Each TOML file defines one selectable specialist. The `teacher_training_dashboard` profile is the lead role for this domain; the other profiles are focused specialists that the active Codex session can delegate to when useful. Codex custom agent profiles are subagents, so the normal conversation remains the top-level orchestrator.

| Agent name | Role |
| --- | --- |
| `code_reviewer` | Performs read-only reviews of dashboard changes and reports concrete correctness, maintainability, and regression risks. |
| `csharp_developer` | Builds or updates .NET and C# components only when those technologies are present in the repository. |
| `db_query_optimizer` | Reviews and improves dashboard data access and query performance while preserving results, authorization, and training record relationships. |
| `devops_azure` | Plans or implements Azure infrastructure and delivery changes when the repository uses Azure and the user requests that scope. |
| `node_developer` | Builds or updates Node.js services for this dashboard when Node.js is part of the repository's actual stack. |
| `product_manager` | Clarifies product goals, user journeys, requirements, and acceptance criteria for dashboard features without assuming unspecified business rules. |
| `react_developer` | Builds or updates the dashboard interface when this repository uses React, following its existing components, routing, state, and styling patterns. |
| `scrum_master` | Turns approved dashboard work into a clear sequence of tasks, dependencies, and completion checks. |
| `security_reviewer` | Performs a read-only security review focused on access control and protection of trainee and certificate data. |
| `teacher_training_dashboard` | Leads end-to-end work on this teacher training dashboard, coordinating feature delivery across programs, trainers, trainee batches, day-wise activities, forms, progress, and completion certificates. |
| `tester_developer` | Designs and implements focused automated tests for dashboard features using the repository's existing test stack. |

Technology-specific profiles should first confirm that their stack exists in the repository. These profiles do not establish business or certification rules. Use the requirements in project files or supplied by the user.
