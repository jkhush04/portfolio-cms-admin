# Portfolio CMS — Admin Panel

Private admin tool for managing all portfolio content. Not linked from
the public site — accessed directly by URL, protected by JWT login.

## Tech Stack
- React 18 (Vite)
- Tailwind CSS v4
- React Router (with a protected-route guard)
- Axios (JWT auto-attached to every request via interceptor)

## Features
- Login (JWT, stored in localStorage, persists across refreshes)
- Sidebar navigation to CRUD screens for every content type: About,
  Skills, Projects, Experience, Testimonials, Services, Blog
- Each list-based screen supports create, edit, and delete in one view

## Running Locally

```bash
npm install
npm run dev -- --port 3001
```

Requires the backend running, plus a `.env` (copy `.env.example`):

VITE_API_BASE_URL=http://localhost:8080


Log in with the admin credentials configured on the backend
(`ADMIN_USERNAME` / `ADMIN_PASSWORD`).

## Building for Production

```bash
npm run build
```

## Deployment
Deployed on [Vercel/- https://portfolio-cms-admin-kappa.vercel.app/], as a separate
deployment from the public portfolio site. Its URL must be added to the
backend's `CORS_ALLOWED_ORIGINS`.

## Related Repos
- Backend + CMS API: `portfolio-cms-backend`
- Public portfolio site: `portfolio-cms-frontend`
