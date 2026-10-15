# CodeRant

CodeRant is a community website for Bangladeshi IT professionals and eligible senior IT students living in Malaysia. The project brings community information, committee details, job listings, articles, and the RantGPT assistant into one web experience.

Live website: https://coderantorg.vercel.app/

## Features

- Home and community information pages
- About and committee pages, including committee member profiles
- Job search and job detail pages
- RantGPT chat interface
- Community and article pages
- Contact and membership application pages
- Admin interface
- Privacy policy, terms, and community guidelines
- Responsive interface with light and dark theme support

## Technology Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Radix UI components
- TanStack Query
- Lucide React
- Express for the local jobs API
- RapidAPI JSearch for job listings

## Requirements

- Node.js (use a current LTS release)
- npm
- Access to the JSearch service if you want to test job search locally

## Getting Started

1. Clone or download this repository.
2. Open a terminal in the project directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. If you want to run the jobs API locally, configure the JSearch service settings in your local environment according to the provider's setup instructions. Keep local configuration files out of version control.

5. Start the frontend development server:

   ```bash
   npm run dev
   ```

   Vite normally serves the frontend at `http://localhost:5173`.

6. To enable the local jobs API, open a second terminal and run:

   ```bash
   node server/index.js
   ```

   The local API listens on `http://localhost:3001`. The Vite development server proxies `/api` requests to this service.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Automatically fix supported ESLint issues |
| `npm run typecheck` | Run the configured TypeScript check |

## Environment Configuration

The jobs integration uses the JSearch service through RapidAPI. Configure the service settings required by the current backend implementation in your local environment or Vercel project settings. Keep environment-specific configuration out of source control, and do not expose private configuration in frontend variables such as `VITE_*`.

## Project Structure

```text
.
├── api/
│   └── jobs.js             # Vercel serverless endpoint for job search
├── public/                 # Static assets
├── server/
│   └── index.js            # Local Express jobs API
├── src/
│   ├── api/                # API client adapters
│   ├── components/         # Shared UI and layout components
│   ├── data/               # Local community and committee data
│   ├── hooks/              # Reusable React hooks
│   ├── lib/                # App utilities and context providers
│   ├── pages/              # Website pages
│   ├── App.jsx             # App routes and providers
│   ├── index.css           # Global styles
│   └── main.jsx            # Frontend entry point
├── index.html
├── package.json
└── vite.config.js
```

## Job Search API

The repository includes two implementations of the jobs endpoint:

- `api/jobs.js` is intended for Vercel serverless deployment.
- `server/index.js` runs a local Express API on port `3001`.

Both use the RapidAPI JSearch service. Configure the service for the environment where you run the application before testing job search. External API availability and results depend on the provider and its usage limits.

## Deployment

The frontend is built with Vite and can be deployed to Vercel or another static hosting provider that supports Vite.

```bash
npm run build
```

The production frontend output is written to `dist/`.

If deploying to Vercel, configure the required environment variables in the Vercel project settings. Confirm that `/api/jobs` is available in the deployed environment and test it after deployment.


## Security

- Keep local environment configuration out of version control.
- Validate and sanitize user input on the server.
- Protect administrative endpoints with real server-side authorization.
- Do not rely on frontend route guards alone to secure private data or admin actions.
- Review environment variables and deployment settings before publishing.

## License

No license has been specified in this repository. Contact the project maintainers before reusing or redistributing the code.
