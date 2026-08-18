# Lead Dossier -- Vercel deployment

This folder is ready to deploy as-is. Two things you need before it'll actually work:

1. An Anthropic API key
2. A Vercel account (free tier is fine)

## What's in this folder

- `index.html` -- the tool itself (frontend)
- `api/research.js` -- a small serverless function that holds your Anthropic API key safely and
  makes the actual research call. The browser never sees the key.
- `package.json` -- lets Vercel recognize this as a project

## Step 1 -- Get an Anthropic API key

1. Go to https://console.anthropic.com
2. Create (or sign into) an account
3. Go to **API Keys** and create a new key
4. Copy it somewhere safe -- you'll paste it into Vercel in Step 3, and you won't be able to see
   it again after you close that page

Note: this will use real API credits billed to that account. Anthropic's console shows current
per-token pricing for whichever model is in `api/research.js` -- check that before rolling this
out to your team so you know roughly what a research run costs.

## Step 2 -- Push this folder to GitHub

If you don't already have a GitHub account, create one at https://github.com. Then:

```bash
cd lead-dossier          # this folder
git init
git add .
git commit -m "Lead Dossier tool"
```

Create a new empty repository on GitHub (no README/license), then:

```bash
git remote add origin https://github.com/<your-username>/lead-dossier.git
git branch -M main
git push -u origin main
```

## Step 3 -- Deploy on Vercel

1. Go to https://vercel.com and sign in (you can sign in with your GitHub account directly)
2. Click **Add New → Project**
3. Select the `lead-dossier` GitHub repo you just pushed
4. Before clicking Deploy, expand **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: *(paste the key from Step 1)*
5. Click **Deploy**

Vercel will give you a live URL like `lead-dossier-yourname.vercel.app` within about a minute.
That's the link you share with your manager.

## Step 4 -- Verify it works

1. Open the live URL
2. Paste a company website or LinkedIn URL and click Research
3. Confirm a dossier card appears with industry/vertical/fit/SDR filled in

If you get an error mentioning `ANTHROPIC_API_KEY`, double-check Step 3.4 -- the environment
variable name has to match exactly, and you may need to redeploy after adding it (Vercel's
dashboard has a "Redeploy" button under the project's Deployments tab).

## About saved settings (SDR tables, ICP criteria, etc.)

The sidebar config and dossier history are saved in the browser's local storage, not in a shared
database. That means:

- Everything works out of the box with the defaults already built in (SDR tables, taxonomy,
  competitor list, etc.)
- If you or your manager edit and save something in the sidebar, that edit is only saved on
  that person's own browser/device -- it won't automatically appear for the other person
- Clearing browser data, or opening the tool in a different browser/incognito window, resets it
  back to the built-in defaults

If you want config and dossier history to be shared live between you and your manager (or a
whole team), that requires wiring up a real backend database (e.g. Vercel KV, Supabase, or
similar) instead of local storage -- happy to help with that as a next step if it'd be useful.

## Updating the tool later

Any time you want to change something (add an SDR, adjust the taxonomy, tweak styling), edit
`index.html` and push the change:

```bash
git add .
git commit -m "describe your change"
git push
```

Vercel automatically redeploys on every push to `main`.
