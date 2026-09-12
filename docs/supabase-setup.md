# Supabase foundation setup

The schema and development catalogue are ready in `supabase/migrations/202609120001_initial_schema.sql` and `supabase/seed.sql`. Apply the migration before connecting application writes.

1. In Supabase SQL Editor, run the migration, then the seed.
2. Copy the project URL and anon/publishable key to `.env.local` from `.env.example`.
3. Store the service-role key only in local server environment and Vercel environment settings; never expose it to the browser.
4. In Supabase Auth, enable Google and set the callback URL to `https://YOUR_DOMAIN/auth/callback` (plus `http://localhost:3000/auth/callback` for local work).
5. After the first approved administrator signs in, promote that profile with a one-off SQL Editor command: `update public.profiles set role = 'admin' where email = 'approved-admin@example.com';`. Replace the placeholder with the explicitly approved administrator email.
6. Create Razorpay orders only from server routes using the service-role client and `RAZORPAY_KEY_SECRET`; verify payment signatures and webhooks before marking an order paid.

The current payment screen intentionally does not process a charge. It must remain that way until steps 1–6 are complete.
