# NearBuy --- Project Context

> **Project:** NearBuy\
> **Domain:** Logistics & Supply Chain Management / Local Commerce\
> **Purpose:** AI-powered local commerce platform that helps customers
> find products at nearby physical stores in real time and optionally
> get those products delivered by a NearBuy rider.

------------------------------------------------------------------------

# 1. Project Overview

NearBuy is a local-commerce platform designed around a simple problem:

> Customers can find shops, but often cannot know whether a specific
> product is actually available at that shop right now.

The platform connects:

``` text
Customers
    ↕
NearBuy
    ↕
Local Physical Shops
    ↕
NearBuy Riders
```

The core experience is:

``` text
Search → Discover → Check → Shop / Get It
```

A customer can:

1.  Search for a product using text, an image, or voice.
2.  NearBuy identifies/matches the requested product.
3.  Nearby physical stores are shown.
4.  The customer compares stores using:
    -   Price
    -   Distance
    -   Availability
    -   Quantity
    -   Rating
5.  The customer can either:
    -   Visit the store / reserve the product
    -   Book a NearBuy rider to pick it up and deliver it.

The project material describes NearBuy as an AI-powered local commerce
platform that brings app-style convenience to local offline stores.

------------------------------------------------------------------------

# 2. Problem Being Solved

The project was motivated by local-shopping pain points identified
through a user survey.

The project presentation reports:

-   53 people surveyed about local shopping pain points.
-   79% reported difficulty finding a specific product nearby at least
    sometimes.
-   32/53 usually visit the shop in person just to check availability.
-   85% of the larger validation group said they would try NearBuy.

The central insight is:

> The problem isn't finding a shop. The problem is knowing what you can
> actually get there.

NearBuy therefore focuses on **real-time local product discovery**,
rather than simply listing nearby businesses.

------------------------------------------------------------------------

# 3. Target Users

NearBuy has three primary application roles.

## 3.1 Customer

The customer uses NearBuy to:

-   Search for products.
-   Upload a product image.
-   Search using voice.
-   Discover nearby shops.
-   Compare price, stock, distance and rating.
-   Reserve products.
-   Place orders.
-   Request delivery.
-   Track the rider live.
-   Receive order/delivery notifications.
-   Review shops.

------------------------------------------------------------------------

## 3.2 Rider

The rider provides the last-mile delivery layer.

The rider should be able to:

-   Log in as a rider.
-   Go online/offline.
-   Set availability.
-   View available delivery jobs.
-   Select/accept a delivery.
-   Navigate to the pickup shop.
-   Pick up the product.
-   Start delivery.
-   Share live GPS location.
-   View the delivery route/map.
-   Update delivery status.
-   Complete delivery.

The customer's map should show the rider's current location while the
delivery is active.

The rider should also see their own current position and route.

------------------------------------------------------------------------

## 3.3 Shop Owner

The shop owner manages a local physical store through a dedicated
dashboard.

The provided prototype shows a shop-owner dashboard containing:

-   Dashboard
-   My Listings
-   Stock Manager
-   AI Bill Scanner
-   Purchase Invoice
-   Proforma
-   Quotation
-   Bank Ledger
-   Expenses
-   P&L Report
-   Bank Details
-   Store Settings

The dashboard also contains:

-   Revenue this month
-   Products listed
-   Platform views
-   Active reservations
-   Revenue overview
-   Category split
-   Recent reservations
-   Low stock alerts

------------------------------------------------------------------------

# 4. Core Product Features

NearBuy has three major feature groups.

## 4.1 AI Product Finder

The customer can:

``` text
Photo
Voice
Text
  ↓
AI Product Identification / Matching
  ↓
Nearby Product Search
```

The system should identify or match the requested product and search
nearby stores.

The AI layer is intended to support:

-   Vision
-   NLP
-   OCR
-   Recommendations
-   Forecasting

------------------------------------------------------------------------

## 4.2 NearBuy Rider

The rider system provides last-mile delivery.

Flow:

``` text
Customer searches product
        ↓
Nearby shops found
        ↓
Customer chooses shop
        ↓
Customer books rider
        ↓
Rider is assigned
        ↓
Rider travels to shop
        ↓
Rider picks up product
        ↓
Rider travels to customer
        ↓
Customer tracks rider
        ↓
Delivery completed
```

The rider system is a major differentiator because NearBuy is not only a
discovery platform; it can also provide the last-mile layer for local
retail.

------------------------------------------------------------------------

## 4.3 Smart+ for Shopkeepers

Smart+ turns a traditional physical shop into a digital store.

The project material identifies these Smart+ capabilities:

### Digital Storefront

-   Products
-   Prices
-   Offers
-   Opening hours
-   Store discoverability

### Smart Inventory

-   Add stock
-   Update stock
-   Track inventory
-   Low-stock alerts
-   Fast/slow mover insights

### AI Business Assistant

Example insight:

``` text
"You may run out of 24-inch monitors in 4 days."
```

### AI Bill Scanner

Shopkeeper photographs an invoice.

``` text
Invoice Photo
     ↓
AI / OCR
     ↓
Extract Items
     ↓
Update Inventory
```

### Profit & Loss Dashboard

Includes:

-   Revenue
-   COGS
-   Margins
-   Best products
-   Highest-margin products

### Sales Analytics

Includes:

-   Daily trends
-   Weekly trends
-   Monthly trends
-   Top products
-   Peak hours

### Promotional Boost

Paid visibility so relevant shops can appear higher in search.

### Payments & Reconciliation

Track:

-   Cash
-   UPI
-   Card
-   Online orders

against sales.

------------------------------------------------------------------------

# 5. Customer User Journey

The project prototype describes the customer journey in three main
steps.

## Step 1 --- Search

Customer opens NearBuy and describes what they need.

Input can be:

``` text
Text
Image
Voice
```

Example:

``` text
"I need a Logitech wireless mouse."
```

or:

``` text
Upload photo of a mouse
```

------------------------------------------------------------------------

## Step 2 --- Results

NearBuy returns nearby stores with information such as:

``` text
Shop
Price
Stock
Distance
Rating
```

Example:

``` text
Product: Wireless Mouse

Shop A
₹899
10 in stock
1.2 km
⭐ 4.6

Shop B
₹849
3 in stock
2.1 km
⭐ 4.3

Shop C
₹950
20 in stock
2.8 km
⭐ 4.5
```

The customer can compare options.

------------------------------------------------------------------------

## Step 3 --- Reserve or Get It

The customer chooses between:

``` text
Visit / Reserve
        OR
Book Rider
```

If the customer books a rider:

``` text
Choose Store
      ↓
Book Rider
      ↓
Rider Picks Up
      ↓
Delivered to Customer
```

------------------------------------------------------------------------

# 6. Product Discovery Logic

The platform should rank or present products using the factors described
in the project:

``` text
Price
Distance
Availability
Quantity
Rating
```

These factors are not necessarily a single fixed formula yet. The
ranking implementation can evolve.

A product result fundamentally represents:

``` text
Product
    +
Shop
    +
Shop-specific Price
    +
Shop-specific Stock
    +
Distance from Customer
    +
Shop Rating
```

------------------------------------------------------------------------

# 7. Important Product Data Model Concept

A product is not owned by one shop.

Example:

``` text
Product:
"Zerodol"

        ↓

Shop A
₹120
15 in stock

Shop B
₹135
8 in stock

Shop C
₹125
2 in stock
```

Therefore the database separates:

``` text
products
```

from:

``` text
shop_products
```

`products` represents the global product identity.

`shop_products` represents the product's shop-specific:

-   Price
-   MRP
-   Stock
-   Availability
-   Discount

This is a core design decision.

------------------------------------------------------------------------

# 8. Reservation Flow

A customer can reserve a product before visiting the shop.

``` text
Customer
   ↓
Search
   ↓
Select Shop
   ↓
Reserve
   ↓
Reservation Created
   ↓
Shop Owner Confirms
   ↓
Product Ready
   ↓
Customer Picks Up
```

Reservation should have a lifecycle such as:

``` text
pending
confirmed
ready
picked_up
cancelled
expired
```

------------------------------------------------------------------------

# 9. Order Flow

An order represents an actual purchase/delivery transaction.

``` text
Customer
   ↓
Order
   ↓
Shop prepares order
   ↓
Ready for pickup
   ↓
Rider pickup
   ↓
Out for delivery
   ↓
Delivered
```

Typical order states:

``` text
pending
confirmed
preparing
ready_for_pickup
picked_up
out_for_delivery
delivered
cancelled
```

Historical order information must remain stable even if the shop later
changes its product price.

Therefore order items store a snapshot of:

``` text
product_name
unit_price
quantity
subtotal
```

------------------------------------------------------------------------

# 10. Rider Architecture

The rider is a user with additional rider-specific information.

``` text
profiles
    |
    v
riders
```

The rider record contains:

-   Vehicle type
-   Vehicle number
-   License number
-   Availability
-   Online status
-   Rating
-   Total deliveries
-   Current location

------------------------------------------------------------------------

# 11. Delivery Architecture

A delivery connects:

``` text
Customer
    ↓
Order
    ↓
Delivery
    ↓
Rider
    ↓
Shop
```

A delivery contains:

-   Order
-   Assigned rider
-   Pickup shop
-   Pickup coordinates
-   Delivery coordinates
-   Delivery status
-   Estimated distance
-   Estimated duration
-   Delivery fee
-   Assignment/acceptance/pickup/delivery timestamps

Delivery states:

``` text
searching_rider
assigned
rider_accepted
rider_at_shop
picked_up
on_the_way
delivered
cancelled
```

------------------------------------------------------------------------

# 12. Live Rider Location

Live tracking is a core feature.

The intended architecture is:

``` text
Rider Phone GPS
       ↓
rider_locations
       ↓
Supabase Realtime
       ↓
Customer Map
```

The rider should see:

``` text
Current rider position
Route
Destination
Delivery status
```

The customer should see:

``` text
Shop location
Rider current location
Customer destination
Delivery status
Estimated progress
```

Do not repeatedly overwrite a single rider row for every GPS update.

Use a dedicated location stream/table for location history.

PostGIS should be used for geographic coordinates and nearby-shop/rider
queries.

------------------------------------------------------------------------

# 13. Location-Based Discovery

Location is fundamental to NearBuy.

The system needs to answer:

``` text
Which shops are near this customer?
```

and:

``` text
Which shops have this product?
```

combined into:

``` text
Which nearby shops have this product available?
```

PostGIS is intended for:

-   Shop locations
-   Customer addresses
-   Rider locations
-   Distance calculations
-   Radius searches

Example:

``` text
Customer location
       ↓
Find shops within 5 km
       ↓
Join available shop products
       ↓
Return matching products
       ↓
Sort by distance / price / availability / rating
```

------------------------------------------------------------------------

# 14. Snap Search

Snap Search is the image-based product search feature.

Flow:

``` text
Customer
   ↓
Take/upload photo
   ↓
Image stored
   ↓
AI Vision service
   ↓
Identify/match product
   ↓
Search product catalog
   ↓
Search nearby shop inventory
   ↓
Show results
```

The image itself should be stored in object storage, while the database
stores the image URL/reference and search metadata.

------------------------------------------------------------------------

# 15. Voice Search

Voice search follows a similar pipeline:

``` text
Customer
   ↓
Voice recording
   ↓
Storage
   ↓
Speech/NLP processing
   ↓
Product query
   ↓
Nearby inventory search
```

The database stores the search metadata and reference to the uploaded
voice file.

------------------------------------------------------------------------

# 16. AI Bill Scanner

Shop owners can photograph supplier/purchase invoices.

Flow:

``` text
Shop Owner
     ↓
Upload invoice image
     ↓
AI/OCR
     ↓
Extract:
  Supplier
  Invoice number
  Date
  Products
  Quantity
  Unit price
     ↓
Review / Confirm
     ↓
Inventory update
```

The system should retain:

-   Original invoice image
-   AI processing status
-   Raw AI/OCR response
-   Extracted items
-   Confidence scores
-   Matched products

------------------------------------------------------------------------

# 17. Inventory Management

Inventory should track both current state and historical movements.

Current state:

``` text
shop_products.quantity
```

Historical movement:

``` text
inventory_movements
```

Possible movement types:

``` text
purchase
sale
reservation
adjustment
return
damage
```

Example:

``` text
Before: 20

Sale: -2

After: 18
```

This makes stock changes auditable.

------------------------------------------------------------------------

# 18. Low Stock Alerts

A shop product contains:

``` text
quantity
low_stock_threshold
```

Example:

``` text
Monitor
Stock = 3
Threshold = 5
```

System:

``` text
3 <= 5
```

→ Generate low-stock alert.

This powers the Shop Owner dashboard's:

``` text
Low Stock Alert
```

section.

------------------------------------------------------------------------

# 19. Shop Owner Dashboard

The provided prototype shows a dashboard similar to:

``` text
Revenue This Month
₹84,320
+12.4% vs last month

Products Listed
8

Platform Views
1,834
+23% this week

Active Reservations
4
2 new today
```

The dashboard also includes:

``` text
Revenue Overview
Category Split
Recent Reservations
Low Stock Alert
```

These values should eventually be calculated from actual database
records rather than hardcoded values.

------------------------------------------------------------------------

# 20. Shop Dashboard Data Sources

  Dashboard Feature     Main Data
  --------------------- ----------------------------------------
  Revenue This Month    `orders`, `transactions`
  Products Listed       `shop_products`
  Platform Views        `shop_views`
  Active Reservations   `reservations`
  Revenue Overview      `transactions`
  Category Split        `categories`, `order_items`
  Recent Reservations   `reservations`
  Low Stock Alert       `shop_products`
  Stock Manager         `shop_products`, `inventory_movements`
  AI Bill Scanner       `scanned_invoices`
  Purchase Invoice      `documents`
  Proforma              `documents`
  Quotation             `documents`
  Bank Ledger           `transactions`
  Expenses              `expenses`
  P&L Report            `transactions`, `expenses`
  Bank Details          `shop_bank_accounts`
  Store Settings        `shops`
  Smart+                `shop_subscriptions`
  Promotional Boost     `promotions`

------------------------------------------------------------------------

# 21. Financial Management

The shop-owner system should support:

``` text
Revenue
COGS
Expenses
Profit
Margins
Payments
Reconciliation
```

Relevant database concepts:

``` text
orders
payments
transactions
expenses
documents
```

The project presentation specifically proposes a P&L dashboard with
revenue, COGS, margins, best products and highest-margin products.

------------------------------------------------------------------------

# 22. Documents

The shop dashboard needs document functionality for:

``` text
Purchase Invoice
Sales Invoice
Proforma
Quotation
```

A generic document model is preferred over four completely separate
systems.

``` text
documents
    |
    +-- document_type
    |
    +-- document_items
```

Possible document types:

``` text
purchase_invoice
sales_invoice
proforma
quotation
```

------------------------------------------------------------------------

# 23. Payments

NearBuy needs to support customer payment tracking.

Payment methods can include:

``` text
cash
upi
card
online
```

The project material proposes Razorpay for customer payments and Smart+
subscriptions.

Payment records should contain:

-   Order
-   Customer
-   Amount
-   Method
-   Gateway
-   Gateway transaction ID
-   Status
-   Paid time

------------------------------------------------------------------------

# 24. Ratings and Reviews

Customers should be able to rate shops.

Rating:

``` text
1 to 5
```

Shop summary can maintain:

``` text
rating
total_reviews
```

Reviews should be connected to the customer, shop and optionally the
order.

Ratings are part of the shop comparison experience.

------------------------------------------------------------------------

# 25. Notifications

All three roles can receive notifications.

### Customer

``` text
Order confirmed
Rider assigned
Rider picked up order
Rider is on the way
Order delivered
Reservation ready
```

### Rider

``` text
New delivery available
Delivery assigned
Customer address updated
```

### Shop Owner

``` text
New reservation
New order
Payment received
Low stock
Invoice processed
```

------------------------------------------------------------------------

# 26. Smart+ Business Model

The project proposes three shop subscription levels:

## Free

Basic:

-   Storefront
-   Basic inventory presence

## Smart+

Includes:

-   Inventory management
-   Analytics
-   AI tools
-   Billing
-   Business dashboard

## Smart+ Pro

Includes advanced:

-   AI insights
-   Demand forecasting
-   Financial analytics
-   Premium visibility

The exact pricing can be configured in the database and should not be
hardcoded into the application.

------------------------------------------------------------------------

# 27. Promotional Boost

Shops can pay for promotional visibility.

Flow:

``` text
Shop Owner
    ↓
Create promotion
    ↓
Set budget
    ↓
Select products
    ↓
Set start/end dates
    ↓
Campaign active
    ↓
Relevant search visibility increases
```

Promotions should be connected to specific `shop_products`.

------------------------------------------------------------------------

# 28. Recommended Technology Architecture

The project proposal specifies the following MVP architecture:

## Frontend

``` text
Next.js
React
TypeScript
Tailwind CSS
PWA support
```

## Backend

``` text
Node.js
Express
or
Next.js API
```

Used for:

-   Authentication-related application logic
-   Orders
-   Inventory
-   Application APIs

## Database

``` text
Supabase PostgreSQL
```

Used for:

-   Users
-   Shops
-   Products
-   Inventory
-   Orders
-   Riders
-   Deliveries

## AI Layer

``` text
Python
FastAPI
```

Used for:

-   Vision
-   NLP
-   OCR
-   Recommendations
-   Forecasting

## Maps & Location

``` text
Google Maps Platform
```

Used for:

-   Store discovery
-   Distance
-   Rider routing
-   Maps
-   Location

## Real-Time

The project proposal mentions:

``` text
Socket.IO / WebSockets
```

For a Supabase-centered implementation, Supabase Realtime can be used
for MVP real-time updates such as rider tracking and order status.

## Payments

``` text
Razorpay
```

Used for:

-   Customer payments
-   Smart+ subscriptions

## Cloud

The project proposal mentions:

``` text
Vercel
AWS / Render / Railway
S3 / Cloudinary
```

------------------------------------------------------------------------

# 29. System Architecture

``` text
                         ┌────────────────────┐
                         │      CUSTOMER      │
                         │  Next.js / PWA     │
                         └─────────┬──────────┘
                                   |
                                   |
                         ┌─────────▼──────────┐
                         │      NEARBUY       │
                         │ Application Layer  │
                         └─────────┬──────────┘
                                   |
              ┌────────────────────┼────────────────────┐
              |                    |                    |
              v                    v                    v
       ┌────────────┐       ┌────────────┐      ┌─────────────┐
       │ Supabase   │       │ FastAPI AI │      │ Google Maps │
       │ PostgreSQL │       │   Layer    │      │   Platform  │
       └──────┬─────┘       └────────────┘      └─────────────┘
              |
       ┌──────┼─────────────────────────┐
       |      |                         |
       v      v                         v
     Shops  Products                 Orders
       |      |                         |
       |      |                         v
       |      |                    Deliveries
       |      |                         |
       |      |                         v
       |      |                      Riders
       |      |                         |
       |      |                         v
       |      |                  Live GPS Location
       |      |                         |
       └──────┴─────────────────────────┘
                         |
                         v
                  Supabase Realtime
                         |
                         v
                    CUSTOMER MAP
```

------------------------------------------------------------------------

# 30. Database Context

The main database entities are:

``` text
AUTH
├── auth.users
└── profiles
    └── addresses

SHOP
├── shops
├── shop_hours
├── shop_bank_accounts
├── shop_views
│
├── categories
│   └── products
│       └── product_images
│
└── shop_products
    └── inventory_movements

CUSTOMER
├── searches
│   └── search_results
├── reservations
│   └── reservation_items
├── orders
│   └── order_items
├── payments
└── reviews

RIDER
├── riders
├── deliveries
│   └── delivery_status_history
└── rider_locations

SHOP MANAGEMENT
├── documents
│   └── document_items
├── scanned_invoices
│   └── scanned_invoice_items
├── expenses
└── transactions

BUSINESS
├── subscription_plans
├── shop_subscriptions
├── promotions
│   └── promotion_products
└── notifications
```

The detailed database structure is maintained separately in
`database.md`.

------------------------------------------------------------------------

# 31. Authentication Model

Use Supabase Auth.

Do not create a custom password table.

``` text
Supabase Auth
     |
     v
auth.users
     |
     v
profiles
```

The application role is stored in:

``` text
profiles.role
```

Roles:

``` text
customer
rider
shop_owner
admin
```

After authentication, the frontend determines which application
interface to show based on the user's role.

------------------------------------------------------------------------

# 32. Authorization Model

Supabase Row Level Security (RLS) should protect application data.

## Customer

Customer should only be able to manage/access their own:

``` text
profile
addresses
searches
reservations
orders
payments
notifications
```

Customers can publicly discover:

``` text
active shops
available products
categories
reviews
```

where appropriate.

------------------------------------------------------------------------

## Rider

Rider should access:

``` text
own rider profile
assigned deliveries
own location updates
relevant delivery information
```

Riders should not have unrestricted access to other riders' private
data.

------------------------------------------------------------------------

## Shop Owner

Shop owners should only manage data belonging to their own shop:

``` text
shop
products/listings
inventory
reservations
orders
documents
invoices
expenses
transactions
subscriptions
promotions
bank details
```

------------------------------------------------------------------------

# 33. Storage

Supabase Storage should be used for uploaded/generated media.

Potential buckets:

``` text
avatars
shop-images
product-images
search-images
search-audio
invoices
documents
receipts
```

The database should store references/URLs rather than binary image/audio
data.

------------------------------------------------------------------------

# 34. Real-Time Features

Supabase Realtime is useful for:

``` text
Rider location updates
Order status
Reservation status
New shop orders
Notifications
```

### Rider example

``` text
Rider App
    |
    | GPS update
    v
rider_locations
    |
    | Realtime
    v
Customer App
    |
    v
Map marker moves
```

### Order example

``` text
Shop Owner
    |
    | Update order status
    v
orders
    |
    | Realtime
    v
Customer
```

------------------------------------------------------------------------

# 35. API / Service Responsibilities

## Next.js / Application Backend

Should handle:

-   Customer-facing application APIs
-   Shop-owner dashboard APIs
-   Rider APIs
-   Orders
-   Reservations
-   Inventory operations
-   Payments integration
-   Authorization checks

## FastAPI AI Service

Should handle:

``` text
Image → Product identification
Voice → Product query
Invoice → OCR extraction
Product → Recommendations
Inventory → Forecasting
```

The AI service should return structured results to the application
backend rather than directly exposing database credentials to the
client.

------------------------------------------------------------------------

# 36. Search Architecture

A future search pipeline can be:

``` text
             CUSTOMER QUERY
                  |
       ┌──────────┼──────────┐
       |          |          |
      TEXT      IMAGE       VOICE
       |          |          |
       v          v          v
    NLP        Vision      Speech/NLP
       |          |          |
       └──────────┼──────────┘
                  |
                  v
          Product Matching
                  |
                  v
          Product Catalog
                  |
                  v
          Shop Inventory
                  |
                  v
        PostGIS Distance
                  |
                  v
       Ranking / Filtering
                  |
                  v
          Search Results
```

------------------------------------------------------------------------

# 37. Nearby Product Search

Conceptually:

``` text
Customer Location
       |
       v
Find nearby shops
       |
       v
Match requested product
       |
       v
Check shop inventory
       |
       v
Check availability
       |
       v
Return:
  Shop
  Price
  Stock
  Distance
  Rating
```

The final implementation should use a PostgreSQL function/RPC with
PostGIS rather than downloading every shop to the frontend.

------------------------------------------------------------------------

# 38. Dashboard Analytics

Dashboard metrics should be derived from transactional data.

Examples:

## Revenue

``` text
orders
+
transactions
```

## Products Listed

``` text
shop_products
```

## Platform Views

``` text
shop_views
```

## Active Reservations

``` text
reservations
```

## Category Split

``` text
categories
+
order_items
```

## Low Stock

``` text
shop_products.quantity
<=
shop_products.low_stock_threshold
```

## P&L

Conceptually:

``` text
Revenue
- COGS
- Expenses
= Profit
```

------------------------------------------------------------------------

# 39. Core Business Rules

## Product availability

A product is available when the shop has:

``` text
quantity > 0
```

and:

``` text
is_available = true
```

Business logic can later account for reservations and other inventory
holds.

------------------------------------------------------------------------

## Shop visibility

Only shops with an appropriate active/verified state should normally
appear in public customer discovery.

------------------------------------------------------------------------

## Reservation

A reservation temporarily represents a customer's intent to obtain a
product from a shop.

Reservations may expire.

------------------------------------------------------------------------

## Delivery

A delivery should be connected to exactly one order for the MVP.

A rider may handle many deliveries over time but should have only the
appropriate active delivery assignment at a time.

------------------------------------------------------------------------

# 40. MVP Scope

The first usable version should prioritize the core loop.

## Phase 1 --- Authentication

``` text
Customer Login
Rider Login
Shop Owner Login
```

## Phase 2 --- Shop & Product

``` text
Create shop
Create products
Add products to shop
Set price
Set stock
```

## Phase 3 --- Customer Search

``` text
Text search
Nearby shops
Price
Stock
Distance
Rating
```

## Phase 4 --- Reservation / Order

``` text
Reserve
Order
Payment
```

## Phase 5 --- Rider

``` text
Rider online
Delivery jobs
Accept delivery
Pickup
Live location
Delivery completion
```

## Phase 6 --- Shop Dashboard

``` text
Inventory
Reservations
Orders
Revenue
Low stock
Basic analytics
```

------------------------------------------------------------------------

# 41. Features for Later Iterations

After the core MVP works, add:

``` text
AI Snap Search
Voice Search
AI Bill Scanner
AI Business Assistant
Demand Forecasting
Advanced P&L
Advanced Analytics
Smart+
Smart+ Pro
Promotional Boost
Advanced reconciliation
```

These features should build on the core:

``` text
Shop
Product
Inventory
Order
Delivery
```

rather than creating an independent system.

------------------------------------------------------------------------

# 42. Suggested Repository Structure

A possible project structure:

``` text
nearbuy/
│
├── frontend/
│   └── nextjs/
│
├── backend/
│   └── node/
│
├── ai-service/
│   └── fastapi/
│
├── database/
│   ├── database.md
│   └── migrations/
│
├── docs/
│   └── context.md
│
└── README.md
```

If the project uses a single Next.js application for frontend and API
routes, the Node/Express backend can be reduced or removed.

------------------------------------------------------------------------

# 43. Development Principles

## Keep the core flow simple

The most important user journey is:

``` text
Find product
    ↓
Find nearby shop
    ↓
Check availability
    ↓
Reserve / Order
    ↓
Get delivered
```

Do not let secondary features make this flow unnecessarily complicated.

------------------------------------------------------------------------

## Database first for core entities

The core entities are:

``` text
User
Shop
Product
Shop Product
Reservation
Order
Rider
Delivery
Location
Payment
```

Everything else should build around these.

------------------------------------------------------------------------

## Avoid hardcoded dashboard data

Prototype values such as:

``` text
₹84,320
1,834 views
4 reservations
```

should eventually be derived from the database.

The visual prototype is a UI reference, not a source of persistent
business data.

------------------------------------------------------------------------

# 44. Current Product Vision

NearBuy should become a bridge between:

``` text
Online Discovery
        +
Offline Local Retail
        +
Last-Mile Delivery
```

Instead of replacing local shops, NearBuy gives them a digital presence
and helps customers discover what is available nearby.

The key product proposition is:

``` text
Your City's Stores.
One Smart Search.
```

The platform should make local physical inventory discoverable in a way
that feels as convenient as modern e-commerce while retaining the
benefits of nearby stores.

------------------------------------------------------------------------

# 45. End-to-End Example

A customer needs a specific medicine/product.

``` text
1. Customer opens NearBuy.

2. Customer searches using text/photo/voice.

3. AI identifies or matches the product.

4. NearBuy searches the product catalog.

5. NearBuy finds shops carrying the product.

6. PostGIS calculates distance.

7. Results are ranked/presented using:
       Price
       Distance
       Availability
       Quantity
       Rating

8. Customer selects a shop.

9. Customer either:
       a. Reserves product
       OR
       b. Books rider

10. If rider is booked:
       Delivery created.

11. Available rider sees delivery.

12. Rider accepts.

13. Rider navigates to shop.

14. Rider picks up product.

15. Delivery becomes "on_the_way".

16. Rider GPS updates continuously.

17. Customer sees rider moving on map.

18. Rider reaches customer.

19. Delivery becomes "delivered".

20. Payment/order/transaction records are finalized.

21. Customer can review the shop.
```

------------------------------------------------------------------------

# 46. Definition of Success for MVP

A successful MVP should demonstrate this complete working path:

``` text
CUSTOMER
    |
    | Search
    v
PRODUCT
    |
    | Available at
    v
SHOP
    |
    | Reserve / Order
    v
DELIVERY
    |
    | Assigned to
    v
RIDER
    |
    | GPS tracking
    v
CUSTOMER
```

At the same time, the shop owner should be able to:

``` text
Login
  ↓
Create/manage shop
  ↓
Add products
  ↓
Manage stock
  ↓
Receive reservation/order
  ↓
See basic revenue/inventory information
```

If these two flows work reliably, the core NearBuy concept is
demonstrated.

------------------------------------------------------------------------

# 47. Source Context

The original NearBuy project material describes:

-   The problem of discovering local product availability.
-   The Search → Discover → Check → Shop / Get It journey.
-   AI Product Finder.
-   NearBuy Rider.
-   Smart+ for Shopkeepers.
-   Inventory and low-stock functionality.
-   AI Bill Scanner.
-   Profit & Loss dashboard.
-   Sales analytics.
-   Promotional Boost.
-   Payments and reconciliation.
-   Smart+ subscription plans.
-   Rider platform fees.
-   Next.js / React / TypeScript frontend.
-   Node.js / Express or Next.js API backend.
-   Supabase PostgreSQL.
-   Python / FastAPI AI layer.
-   Google Maps Platform.
-   Real-time WebSocket-based architecture.
-   Razorpay.
-   Vercel / AWS / Render / Railway / S3 / Cloudinary.

The source material also presents the project as a logistics and
supply-chain management solution for local commerce.

------------------------------------------------------------------------

# 48. Related Documentation

``` text
context.md
    ↓
Overall project context and product requirements

database.md
    ↓
Detailed Supabase database structure

Supabase SQL migration
    ↓
Actual database implementation
```

Keep these documents aligned when the project architecture changes.
