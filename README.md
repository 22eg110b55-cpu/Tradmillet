# TradMillet Foods (Next.js 14 E‑commerce Demo)

Modern, responsive e-commerce website for **TradMillet Foods** — *Traditional Nutrition. Modern Health.*

## Tech

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Node.js API routes (`app/api`)
- Local JSON product database (`data/products.json`)

## Run locally

```bash
cd tradmillet-website
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin setup

Create a file named `.env.local` in `tradmillet-website/`:

```bash
ADMIN_EMAIL=owner@tradmilletfoods.com
ADMIN_PASSWORD=change-me
ADMIN_TOKEN_SECRET=change-me-to-a-long-random-string

# Optional owner notifications
OWNER_EMAIL=rajeshshivandhuni3@gmail.com
OWNER_WHATSAPP_PHONE=917893256535

# Optional SMTP for email notifications
SMTP_HOST=rajeshshivandhuni3@gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
SMTP_FROM="TradMillet Foods <your-smtp-user>"
```

Then visit:

- `/admin/login`
- `/admin` (products)
- `/admin/orders` (orders)

## Environment variables

Use `.env.example` as the source of truth. For local development:

```bash
cp .env.example .env.local
```

Set required values at least for:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_TOKEN_SECRET`
- `CUSTOMER_TOKEN_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## Deploy on Render (Docker)

This app writes to disk for:

- JSON data files (orders/products/customers)
- Uploaded images (`/uploads/*`)

So configure persistent storage using:

- `DATA_DIR=/var/data/tradmillet/data`
- `UPLOAD_DIR=/var/data/tradmillet/uploads`

### Steps

1. Push `tradmillet-website/` to GitHub.
2. In Render, create a **Blueprint** and select this repo (uses `render.yaml`).
3. Confirm the persistent disk is mounted at `/var/data/tradmillet`.
4. In Render dashboard, fill all secret env vars marked `sync: false`.
5. Deploy.

### Verify after deploy

- Open `/admin/login`, sign in, create or edit a product.
- Place a test order from `/checkout`.
- Upload a product image from admin and confirm it is visible after restart.

## Key routes

- `/` homepage
- `/products` products + filters
- `/products/[slug]` product details
- `/cart` cart (localStorage persisted)
- `/checkout` demo checkout
- `/quiz` health recommendation quiz
- `/recipes` recipe section
- `/blog` + `/blog/[slug]`
- `/about`, `/contact`

## API routes (basic backend)

- `GET /api/products`
- `POST /api/products` (admin)
- `PUT/DELETE /api/products/[id]` (admin)
- `GET /api/products/[slug]`
- `POST /api/orders` (customer checkout)
- `GET /api/orders` (admin)
- `PATCH /api/orders/[id]` (admin)


