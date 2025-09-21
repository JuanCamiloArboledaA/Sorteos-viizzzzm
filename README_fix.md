
# sorteos-viizzzm (Vercel serverless)

- Express app moved to `app.js` (no `listen()`).
- Serverless handler at `api/index.js` using `serverless-http`.
- Add the following env vars in Vercel (Project → Settings → Environment Variables):
  - TWITCH_CLIENT_ID
  - TWITCH_CLIENT_SECRET
  - TWITCH_CALLBACK_URL (e.g. https://<your-project>.vercel.app/auth/twitch/callback)
  - SESSION_SECRET
  - SUPABASE_URL
  - SUPABASE_KEY
- Optional: DATABASE_URL if you use `pg` elsewhere.

Routes:
- `/` health check
- `/auth/twitch`
- `/auth/twitch/callback`
- `/dashboard`
