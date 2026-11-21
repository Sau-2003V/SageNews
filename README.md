# SageNews

A newspaper-style headlines app built with React, Vite and Tailwind, using [NewsData.io](https://newsdata.io) for news.

## How it fits together

- `src/` – the React app. It fetches news from **our own** `/api/news` endpoint, never from NewsData.io directly.
- `api/news.js` – a Vercel serverless function that calls NewsData.io with the secret key and returns cleaned-up articles. Responses are cached on Vercel's CDN for 10 minutes, so many visitors share one API request.
- `api/_newsdata.js` – the shared NewsData.io code, also used by `npm run dev` (see `vite.config.js`).
- `vercel.json` – sends every non-`/api` URL to `index.html`, so refreshing `/technology` etc. works.

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env.local` and put your NewsData.io key in it, then:

```bash
npm run dev
```

Open http://localhost:5173.

## Deploy to Vercel

1. Push this folder to a GitHub (or GitLab / Bitbucket) repository. `.env.local` is git-ignored, so your key is not uploaded.
2. On [vercel.com](https://vercel.com) choose **Add New → Project** and import the repository. Vercel detects Vite automatically.
3. Before deploying, open **Environment Variables** and add:
   - Name: `NEWSDATA_API_KEY`
   - Value: your NewsData.io key
4. Click **Deploy**.

To deploy from the command line instead:

```bash
npm i -g vercel
```

```bash
vercel env add NEWSDATA_API_KEY
```

```bash
vercel --prod
```

If you change the environment variable later, redeploy for it to take effect.
