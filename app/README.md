# Shahzad Abaya's Ecommerce

SvelteKit storefront and admin panel for Shahzad Abaya's.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.15.3 create --template minimal --types ts --add prettier tailwindcss="plugins:typography,forms" --install npm app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## Manual Vercel Deploy

The deploy root is this `app` folder. In Vercel, set:

```txt
Root Directory: app
Framework Preset: SvelteKit
Install Command: npm install
Build Command: npm run build
Output Directory: leave default
Node.js Version: 22.x
```

Required production environment variables:

```sh
DATABASE_URL="your Neon pooled PostgreSQL URL with sslmode=require"
PUBLIC_SITE_URL="https://your-vercel-domain.vercel.app"
SITE_URL="https://your-vercel-domain.vercel.app"
ADMIN_SESSION_SECRET="use-a-long-random-secret"
AUTH_SECRET="use-a-long-random-secret"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
CLOUDINARY_FOLDER="shahzad-abayas"
```

Optional order email variables:

```sh
RESEND_API_KEY=""
RESEND_FROM_EMAIL="Shahzad Abaya's <orders@your-domain.com>"
ORDER_NOTIFY_EMAIL=""
PUBLIC_META_PIXEL_ID=""
PUBLIC_TIKTOK_PIXEL_ID=""
```

Before the first production deploy, make sure the Neon database has the latest schema:

```sh
Open Vercel Project Settings -> Environment Variables and add the values above first.

Then make sure your production database already has the latest schema by running `npx prisma db push`
once from your local machine against the same `DATABASE_URL` you plan to use on Vercel.

If you want the default admin user created, run `npx prisma db seed` locally against that same
production database before the first deploy.
```

Do not upload local `static/uploads` to Vercel. Production product/review uploads should go to
Cloudinary because serverless file writes are not persistent.

Admin panel URL:

```txt
/shahzad-secure-admin-4db067e1/login
```

Minimal seed/reset command:

```sh
npx prisma db seed
```

Set `ADMIN_SEED_PASSWORD` before running the seed if you want a specific admin password. If it is
missing, the seed command generates and prints a one-time password for:

```txt
admin@shahzadabayas.com
```

## Image Uploads On Vercel

Vercel serverless deployments do not keep files written to `static/uploads`, so production image
uploads should use Cloudinary. The app automatically uploads product and review images to Cloudinary
when either `CLOUDINARY_URL` exists:

```sh
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
CLOUDINARY_FOLDER=shahzad-abayas
```

Or when these separate environment variables exist:

```sh
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=shahzad-abayas
```

Add the same variables in Vercel Project Settings -> Environment Variables, then redeploy.
Local development can keep using `static/uploads` if the Cloudinary variables are missing.
