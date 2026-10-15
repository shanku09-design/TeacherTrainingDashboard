# Teacher Training Tracker — Demo

Responsive, role-based front-end prototype based on the project PRD and supplied tracker prototype.

## Run

From this `codebase` folder run `npm run start`, then open `http://127.0.0.1:4173` in Chrome. Keep the terminal running while using the app. The local server keeps login and dashboard on the same origin so demo sessions work. Choose Admin, Trainer, or Trainee, then select **Continue to dashboard**. The dashboard navigation includes programme setup, batches, attendance, training plans, assessments, feedback, reports, resources, progress, and certificates. Each login creates browser-only demo access and refresh tokens that expire after 30 minutes. **Sign out** clears the app-owned tokens and role from browser storage and invalidates that demo session in other open tabs. The learning library opens working demo previews: three-page sample PDFs with navigation/print controls, an animated video player with seek/restart/transcript controls, interactive forms with required answers and browser-local saved submissions, a four-slide presentation viewer, and a step-by-step multimedia package. All interactions use sample data in the browser.

Demo personas (selecting a persona pre-fills these values):

| Role | Email | Password |
|---|---|---|
| Admin | admin@training.demo | Admin123! |
| Trainer | rohan.verma@training.demo | Trainer123! |
| Trainee | anita.yadav@training.demo | Trainee123! |

## Structure

- `server.mjs` — local static server for same-origin demo sessions
- `index.html` — persona selection and prefilled demo login
- `dashboard.html` — role-aware dashboard and application pages
- `assets/js` — login and dashboard interactions
- `assets/css` — browser-ready stylesheets
- `src/scss` — Sass source and theme tokens

Compile Sass after installing Sass: `npx sass src/scss/main.scss assets/css/app.css --no-source-map`. Bootstrap 5.3.8 is included by CDN.

## Demo scope

This is a client-side prototype with sample data. Persona selection creates demo-only tokens in browser session storage; they are not server-authenticated credentials and cannot revoke server-issued tokens. Sign out or expiry clears the app-owned token keys. Production authentication, role enforcement, and tenant isolation require a backend.
