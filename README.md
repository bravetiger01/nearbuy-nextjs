# Nearbuy

Nearbuy is a digital platform connecting local customers with nearby shops. 
This project currently runs as a Next.js (App Router) single-page application MVP for a hackathon.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Shopkeeper Dashboard Features (MVP)

The Shopkeeper (Owner) Dashboard allows local businesses to manage their online presence, inventory, and sales on Nearbuy.

### How to Access the Shop Owner Dashboard
1. Open the homepage at `http://localhost:3000`.
2. Click the **"SHOP OWNER LOGIN"** button in the top right navigation bar.
3. Select the **"Shop Owner"** role in the modal.
4. Enter the demo credentials:
   - **Email:** `admin@gmail.com`
   - **Password:** `admin123`
5. Click **"SIGN IN"**.

### Key Features
* **Dashboard:** At-a-glance KPIs, quick action buttons, revenue charts, recent orders, and low-stock alerts.
* **Stock Manager (Inventory):** Search and filter your catalog. Track SKUs, Cost Price, Supplier, and Profit Margins. Update stock numbers inline with one click.
* **AI Bill Scanner:** Upload a supplier invoice, and our mock AI will parse the items (Notebooks, Pens, etc.) so you can add them to your inventory in seconds.
* **Sales Analytics:** Track your store's performance across different time ranges (Today, 7D, 30D, 3M). Includes Revenue vs Orders chart and Top / Slow moving product tables.
* **Promotions:** Create and toggle discounts on your store to boost sales.
* **Payments & Reconciliation:** View a table of all transactions (UPI, Cash, Card, Online) and total daily settlements.
* **AI Business Assistant:** A chat interface where you can ask your AI assistant about low stock, best sellers, revenue, and profit margins. It uses deterministic insights based on your store data.
* **Storefront Preview:** Preview exactly how your store profile and listed products appear to customers on the Nearbuy mobile app.
* **Store Settings:** Manage basic store information and choose a subscription plan (Free, Smart+, Smart+ Pro).

### Architecture & Design
* **Frontend:** Next.js 16, React 19, TypeScript.
* **State Management:** All state (Inventory, Orders, Chat, Promotions) is managed centrally in `lib/store-context.tsx` and persists during the session.
* **Mock Data Layer:** Found in `lib/data.ts`. This provides the initial seed data for products, sales, and analytics without needing a backend during the demo.
* **Styling:** Custom Vanilla CSS (`app/globals.css`). The UI follows a strict "Boxy" design system: zero border radius, hard borders (`2px solid var(--black)`), and pixel-art style drop shadows.
