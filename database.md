# NearBuy Database Structure

> Supabase / PostgreSQL database design for the NearBuy local commerce
> platform.

## 1. Overview

NearBuy connects three primary user types:

-   **Customer** --- searches for products, discovers nearby shops,
    reserves products, places orders, pays, tracks riders, and reviews
    shops.
-   **Rider** --- sees available delivery jobs, accepts deliveries,
    picks products from shops, and shares live GPS location.
-   **Shop Owner** --- manages a digital storefront, products,
    inventory, reservations, orders, invoices, expenses, transactions,
    subscriptions, and promotions.

### Core application flow

``` text
Customer
   |
   | Search / Snap / Voice
   v
Product Discovery
   |
   v
Nearby Shops
   |
   | Price + Stock + Distance + Rating
   v
Reserve / Order
   |
   v
Delivery
   |
   v
Rider
   |
   | Live GPS
   v
Customer
```

------------------------------------------------------------------------

# 2. High-Level ER Structure

``` text
auth.users
    |
    v
profiles
    |
    +------------------+-------------------+
    |                  |                   |
    v                  v                   v
Customer             Rider            Shop Owner
    |                  |                   |
    |                  v                   v
    |               riders               shops
    |                                      |
    |                         +------------+------------+
    |                         |            |            |
    |                         v            v            v
    |                    shop_hours   shop_products  shop_bank_accounts
    |                                      |
    |                                      v
    |                                  products
    |                                      |
    |                                      v
    |                                categories
    |
    +--> addresses
    |
    +--> searches
    |       |
    |       v
    |   search_results
    |
    +--> reservations
    |       |
    |       v
    |   reservation_items
    |
    +--> orders <---------------- deliveries <----- riders
            |
            +--> order_items
            +--> payments
            +--> reviews

riders
    |
    +--> rider_locations
    |
    +--> deliveries
            |
            v
    delivery_status_history

shops
    |
    +--> documents --> document_items
    +--> scanned_invoices --> scanned_invoice_items
    +--> expenses
    +--> transactions
    +--> subscriptions
    +--> promotions --> promotion_products
    +--> shop_views
```

------------------------------------------------------------------------

# 3. Authentication & Users

Supabase Authentication provides:

``` text
auth.users
```

The application-specific user information is stored in:

## `profiles`

  Column         Type          Description
  -------------- ------------- ---------------------------------------
  `id`           uuid PK       References `auth.users.id`
  `full_name`    text          User's full name
  `phone`        text          Phone number
  `email`        text          Email
  `avatar_url`   text          Profile image
  `role`         user_role     customer / rider / shop_owner / admin
  `is_active`    boolean       Account status
  `created_at`   timestamptz   Creation time
  `updated_at`   timestamptz   Last update

### Roles

``` text
customer
rider
shop_owner
admin
```

A single Supabase Auth account has one application role.

------------------------------------------------------------------------

# 4. Customer

## `addresses`

Stores customer delivery and saved addresses.

  Column             Type                    Description
  ------------------ ----------------------- --------------------
  `id`               uuid PK                 Address ID
  `user_id`          uuid FK                 Customer
  `label`            text                    Home, Work, etc.
  `address_line_1`   text                    Main address
  `address_line_2`   text                    Additional address
  `city`             text                    City
  `state`            text                    State
  `pincode`          text                    Postal code
  `latitude`         double precision        Latitude
  `longitude`        double precision        Longitude
  `location`         geography(Point,4326)   PostGIS location
  `is_default`       boolean                 Default address
  `created_at`       timestamptz             Creation time

------------------------------------------------------------------------

# 5. Shops

## `shops`

Represents a physical shop listed on NearBuy.

  Column              Type                    Description
  ------------------- ----------------------- -----------------------
  `id`                uuid PK                 Shop ID
  `owner_id`          uuid FK                 Shop owner's profile
  `name`              text                    Shop name
  `description`       text                    Shop description
  `phone`             text                    Shop phone
  `email`             text                    Shop email
  `address_line_1`    text                    Address
  `address_line_2`    text                    Additional address
  `city`              text                    City
  `state`             text                    State
  `pincode`           text                    Postal code
  `latitude`          double precision        Latitude
  `longitude`         double precision        Longitude
  `location`          geography(Point,4326)   PostGIS location
  `logo_url`          text                    Shop logo
  `cover_image_url`   text                    Shop cover
  `rating`            numeric(2,1)            Average rating
  `total_reviews`     integer                 Review count
  `is_open`           boolean                 Current open state
  `is_verified`       boolean                 Verification status
  `status`            shop_status             Shop lifecycle status
  `created_at`        timestamptz             Creation time
  `updated_at`        timestamptz             Last update

### Shop status

``` text
pending
active
suspended
closed
```

------------------------------------------------------------------------

## `shop_hours`

Stores weekly opening hours.

  Column          Type      Description
  --------------- --------- -----------------
  `id`            uuid PK   ID
  `shop_id`       uuid FK   Shop
  `day_of_week`   integer   0-6
  `open_time`     time      Opening time
  `close_time`    time      Closing time
  `is_closed`     boolean   Closed that day

Unique constraint:

``` text
(shop_id, day_of_week)
```

------------------------------------------------------------------------

# 6. Product Catalog

## `categories`

Supports product categories and nested categories.

  Column          Type          Description
  --------------- ------------- -----------------
  `id`            uuid PK       Category ID
  `name`          text          Category name
  `description`   text          Description
  `image_url`     text          Category image
  `parent_id`     uuid FK       Parent category
  `created_at`    timestamptz   Creation time

Example:

``` text
Stationery
├── Notebooks
├── Pens
├── Paper
└── Office

Electronics
├── Monitors
├── Keyboards
└── Mouse
```

------------------------------------------------------------------------

## `products`

Global product catalog.

  Column          Type          Description
  --------------- ------------- ---------------------
  `id`            uuid PK       Product ID
  `name`          text          Product name
  `description`   text          Product description
  `brand`         text          Brand
  `category_id`   uuid FK       Category
  `sku`           text          SKU
  `barcode`       text          Barcode
  `unit`          text          Unit
  `image_url`     text          Main image
  `created_at`    timestamptz   Creation time
  `updated_at`    timestamptz   Last update

------------------------------------------------------------------------

## `product_images`

Additional product images.

  Column         Type          Description
  -------------- ------------- ---------------
  `id`           uuid PK       Image ID
  `product_id`   uuid FK       Product
  `image_url`    text          Image URL
  `sort_order`   integer       Display order
  `created_at`   timestamptz   Creation time

------------------------------------------------------------------------

# 7. Shop Inventory

## `shop_products`

This is one of the most important tables in NearBuy.

A global product can be sold by many shops, with each shop having its
own price and stock.

  Column                  Type            Description
  ----------------------- --------------- -------------------------
  `id`                    uuid PK         Shop-product ID
  `shop_id`               uuid FK         Shop
  `product_id`            uuid FK         Global product
  `price`                 numeric(12,2)   Selling price
  `mrp`                   numeric(12,2)   MRP
  `quantity`              integer         Current stock
  `low_stock_threshold`   integer         Low-stock limit
  `discount_percentage`   numeric(5,2)    Discount
  `is_available`          boolean         Available for customers
  `created_at`            timestamptz     Creation time
  `updated_at`            timestamptz     Last update

Unique constraint:

``` text
(shop_id, product_id)
```

### Why this table exists

``` text
products
    |
    +---- Notebook
           |
           +---- Shop A: ₹50, stock 20
           +---- Shop B: ₹48, stock 8
           +---- Shop C: ₹55, stock 30
```

This enables NearBuy to compare:

-   Price
-   Distance
-   Availability
-   Quantity
-   Shop rating

------------------------------------------------------------------------

## `inventory_movements`

Tracks how stock changes.

  -----------------------------------------------------------------------
  Column                  Type                    Description
  ----------------------- ----------------------- -----------------------
  `id`                    uuid PK                 Movement ID

  `shop_product_id`       uuid FK                 Shop product

  `movement_type`         text                    purchase / sale /
                                                  reservation /
                                                  adjustment / return /
                                                  damage

  `quantity`              integer                 Quantity changed

  `previous_quantity`     integer                 Stock before change

  `new_quantity`          integer                 Stock after change

  `reference_type`        text                    Source type

  `reference_id`          uuid                    Source record

  `created_at`            timestamptz             Creation time
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 8. Customer Search

NearBuy supports text, image/snap, and voice search.

## `searches`

  Column                  Type          Description
  ----------------------- ------------- ----------------------
  `id`                    uuid PK       Search ID
  `customer_id`           uuid FK       Customer
  `search_type`           search_type   text / image / voice
  `query_text`            text          Text query
  `image_url`             text          Uploaded image
  `voice_url`             text          Voice input
  `ai_detected_product`   text          AI result
  `created_at`            timestamptz   Creation time

### Search types

``` text
text
image
voice
```

------------------------------------------------------------------------

## `search_results`

Stores products/shops returned by a search.

  Column              Type          Description
  ------------------- ------------- -----------------
  `id`                uuid PK       Result ID
  `search_id`         uuid FK       Search
  `shop_product_id`   uuid FK       Shop product
  `distance_km`       numeric       Distance
  `availability`      boolean       Availability
  `price`             numeric       Price at search
  `ranking_score`     numeric       Search ranking
  `created_at`        timestamptz   Creation time

Example result:

``` text
Search: "HP Wireless Mouse"

Shop A   ₹899   10 stock   1.2 km
Shop B   ₹849    3 stock   2.1 km
Shop C   ₹950   20 stock   2.8 km
```

------------------------------------------------------------------------

# 9. Reservations

## `reservations`

Used when a customer reserves a product at a physical shop.

  Column          Type                 Description
  --------------- -------------------- --------------------
  `id`            uuid PK              Reservation ID
  `customer_id`   uuid FK              Customer
  `shop_id`       uuid FK              Shop
  `status`        reservation_status   Reservation state
  `notes`         text                 Customer notes
  `expires_at`    timestamptz          Reservation expiry
  `created_at`    timestamptz          Creation time
  `updated_at`    timestamptz          Last update

### Reservation statuses

``` text
pending
confirmed
ready
picked_up
cancelled
expired
```

------------------------------------------------------------------------

## `reservation_items`

  Column              Type            Description
  ------------------- --------------- ----------------------
  `id`                uuid PK         ID
  `reservation_id`    uuid FK         Reservation
  `shop_product_id`   uuid FK         Shop product
  `quantity`          integer         Quantity
  `unit_price`        numeric(12,2)   Price at reservation

------------------------------------------------------------------------

# 10. Orders

## `orders`

Represents an actual customer purchase/delivery order.

  Column                  Type             Description
  ----------------------- ---------------- ----------------------
  `id`                    uuid PK          Order ID
  `customer_id`           uuid FK          Customer
  `shop_id`               uuid FK          Shop
  `reservation_id`        uuid FK          Optional reservation
  `delivery_address_id`   uuid FK          Delivery address
  `status`                order_status     Order state
  `subtotal`              numeric          Product total
  `delivery_fee`          numeric          Delivery fee
  `platform_fee`          numeric          NearBuy platform fee
  `discount`              numeric          Discount
  `total_amount`          numeric          Final amount
  `payment_status`        payment_status   Payment state
  `notes`                 text             Notes
  `created_at`            timestamptz      Creation time
  `updated_at`            timestamptz      Last update

### Order statuses

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

------------------------------------------------------------------------

## `order_items`

Stores the products purchased in an order.

  Column              Type          Description
  ------------------- ------------- --------------------------
  `id`                uuid PK       Item ID
  `order_id`          uuid FK       Order
  `shop_product_id`   uuid FK       Shop product
  `product_name`      text          Snapshot of product name
  `quantity`          integer       Quantity
  `unit_price`        numeric       Price at purchase
  `subtotal`          numeric       Item subtotal
  `created_at`        timestamptz   Creation time

### Why store `product_name` and `unit_price` again?

Historical orders must remain correct even if the shop later changes the
product name or price.

------------------------------------------------------------------------

# 11. Riders

## `riders`

Rider-specific information.

  -----------------------------------------------------------------------
  Column                  Type                    Description
  ----------------------- ----------------------- -----------------------
  `id`                    uuid PK                 Rider ID

  `user_id`               uuid FK                 Rider profile

  `vehicle_type`          text                    Bike, scooter, etc.

  `vehicle_number`        text                    Vehicle registration

  `license_number`        text                    License

  `is_available`          boolean                 Available for jobs

  `is_online`             boolean                 Currently online

  `rating`                numeric(2,1)            Rider rating

  `total_deliveries`      integer                 Completed deliveries

  `current_latitude`      double precision        Current latitude

  `current_longitude`     double precision        Current longitude

  `current_location`      geography(Point,4326)   Current PostGIS
                                                  location

  `created_at`            timestamptz             Creation time

  `updated_at`            timestamptz             Last update
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 12. Deliveries

## `deliveries`

Connects an order, shop, rider, pickup location and customer
destination.

  Column                         Type               Description
  ------------------------------ ------------------ --------------------
  `id`                           uuid PK            Delivery ID
  `order_id`                     uuid FK            Order
  `rider_id`                     uuid FK            Assigned rider
  `pickup_shop_id`               uuid FK            Pickup shop
  `pickup_latitude`              double precision   Pickup latitude
  `pickup_longitude`             double precision   Pickup longitude
  `delivery_latitude`            double precision   Customer latitude
  `delivery_longitude`           double precision   Customer longitude
  `status`                       delivery_status    Delivery state
  `estimated_distance_km`        numeric            Distance
  `estimated_duration_minutes`   integer            ETA
  `delivery_fee`                 numeric            Delivery fee
  `assigned_at`                  timestamptz        Assignment time
  `accepted_at`                  timestamptz        Rider acceptance
  `picked_up_at`                 timestamptz        Pickup time
  `delivered_at`                 timestamptz        Delivery time
  `created_at`                   timestamptz        Creation time
  `updated_at`                   timestamptz        Last update

### Delivery statuses

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

# 13. Live Rider Tracking

## `rider_locations`

Stores GPS updates from the rider.

  Column          Type                    Description
  --------------- ----------------------- ------------------
  `id`            bigint PK               Location record
  `rider_id`      uuid FK                 Rider
  `delivery_id`   uuid FK                 Current delivery
  `latitude`      double precision        Latitude
  `longitude`     double precision        Longitude
  `location`      geography(Point,4326)   PostGIS point
  `accuracy`      double precision        GPS accuracy
  `heading`       double precision        Direction
  `speed`         double precision        Speed
  `recorded_at`   timestamptz             GPS timestamp

### Live tracking flow

``` text
Rider App
    |
    v
GPS
    |
    v
rider_locations
    |
    v
Supabase Realtime
    |
    +-------------> Rider UI
    |
    +-------------> Customer UI
```

Do not write a new GPS coordinate into the `riders` table every few
seconds. Use `rider_locations` for live tracking/history.

------------------------------------------------------------------------

# 14. Delivery Status History

## `delivery_status_history`

Tracks every delivery state transition.

  Column          Type               Description
  --------------- ------------------ -------------------------
  `id`            uuid PK            ID
  `delivery_id`   uuid FK            Delivery
  `status`        delivery_status    New status
  `latitude`      double precision   Location
  `longitude`     double precision   Location
  `changed_by`    uuid FK            User who changed status
  `created_at`    timestamptz        Change time

Example:

``` text
12:30  assigned
12:32  rider_accepted
12:41  rider_at_shop
12:46  picked_up
12:58  on_the_way
13:12  delivered
```

------------------------------------------------------------------------

# 15. Payments

## `payments`

  Column              Type             Description
  ------------------- ---------------- ----------------------------
  `id`                uuid PK          Payment ID
  `order_id`          uuid FK          Order
  `customer_id`       uuid FK          Customer
  `amount`            numeric          Amount
  `payment_method`    payment_method   cash / UPI / card / online
  `payment_gateway`   text             e.g. Razorpay
  `transaction_id`    text             Gateway transaction
  `status`            payment_status   Payment status
  `paid_at`           timestamptz      Payment time
  `created_at`        timestamptz      Creation time

------------------------------------------------------------------------

# 16. Reviews

## `reviews`

Customers can review shops after an order.

  Column          Type          Description
  --------------- ------------- ---------------
  `id`            uuid PK       Review ID
  `customer_id`   uuid FK       Customer
  `shop_id`       uuid FK       Shop
  `order_id`      uuid FK       Related order
  `rating`        integer       1-5
  `review`        text          Review
  `created_at`    timestamptz   Creation time

Unique constraint:

``` text
(customer_id, order_id)
```

------------------------------------------------------------------------

# 17. Shop Dashboard

## `shop_views`

Tracks views of shop pages.

  Column          Type          Description
  --------------- ------------- ---------------------------------
  `id`            bigint PK     View ID
  `shop_id`       uuid FK       Shop
  `customer_id`   uuid FK       Optional customer
  `source`        text          Search, direct, promotion, etc.
  `created_at`    timestamptz   View time

Used for:

``` text
Platform Views
```

in the shop-owner dashboard.

------------------------------------------------------------------------

# 18. Documents

## `documents`

Supports:

-   Purchase Invoice
-   Sales Invoice
-   Proforma
-   Quotation

  Column              Type            Description
  ------------------- --------------- ---------------------
  `id`                uuid PK         Document ID
  `shop_id`           uuid FK         Shop
  `document_type`     document_type   Document type
  `document_number`   text            Document number
  `customer_id`       uuid FK         Optional customer
  `customer_name`     text            Customer name
  `total_amount`      numeric         Total
  `status`            text            draft / issued etc.
  `file_url`          text            Generated document
  `created_at`        timestamptz     Creation time
  `updated_at`        timestamptz     Last update

------------------------------------------------------------------------

## `document_items`

  Column          Type      Description
  --------------- --------- ------------------
  `id`            uuid PK   Item ID
  `document_id`   uuid FK   Document
  `product_id`    uuid FK   Product
  `description`   text      Item description
  `quantity`      numeric   Quantity
  `unit_price`    numeric   Unit price
  `tax`           numeric   Tax
  `subtotal`      numeric   Subtotal

------------------------------------------------------------------------

# 19. AI Bill Scanner

## `scanned_invoices`

Stores invoices uploaded for OCR/AI processing.

  Column                Type          Description
  --------------------- ------------- ---------------------
  `id`                  uuid PK       ID
  `shop_id`             uuid FK       Shop
  `image_url`           text          Invoice image
  `supplier_name`       text          Supplier
  `invoice_number`      text          Invoice number
  `invoice_date`        date          Invoice date
  `total_amount`        numeric       Invoice total
  `processing_status`   text          Processing state
  `raw_ai_response`     jsonb         Raw AI/OCR response
  `created_at`          timestamptz   Creation time

### Processing status

``` text
uploaded
processing
completed
failed
review_required
```

------------------------------------------------------------------------

## `scanned_invoice_items`

  Column                 Type          Description
  ---------------------- ------------- -------------------
  `id`                   uuid PK       Item ID
  `scanned_invoice_id`   uuid FK       Scanned invoice
  `product_id`           uuid FK       Matched product
  `extracted_name`       text          AI-extracted name
  `quantity`             numeric       Quantity
  `unit_price`           numeric       Price
  `confidence_score`     numeric       AI confidence
  `created_at`           timestamptz   Creation time

Flow:

``` text
Invoice Photo
      |
      v
AI / OCR
      |
      v
scanned_invoices
      |
      v
scanned_invoice_items
      |
      v
Inventory Update
```

------------------------------------------------------------------------

# 20. Expenses

## `expenses`

Used by the shop-owner dashboard and P&L.

  Column             Type             Description
  ------------------ ---------------- ------------------
  `id`               uuid PK          Expense ID
  `shop_id`          uuid FK          Shop
  `category`         text             Expense category
  `description`      text             Description
  `amount`           numeric          Amount
  `expense_date`     date             Date
  `payment_method`   payment_method   Payment method
  `receipt_url`      text             Receipt
  `created_at`       timestamptz      Creation time

Example:

``` text
Rent          ₹20,000
Electricity    ₹4,500
Internet       ₹1,000
Packaging      ₹2,000
```

------------------------------------------------------------------------

# 21. Shop Transactions / Ledger

## `transactions`

Used for the Bank Ledger, reconciliation and financial reports.

  -----------------------------------------------------------------------
  Column                  Type                    Description
  ----------------------- ----------------------- -----------------------
  `id`                    uuid PK                 Transaction ID

  `shop_id`               uuid FK                 Shop

  `order_id`              uuid FK                 Related order

  `transaction_type`      text                    sale / refund / expense
                                                  / deposit / withdrawal
                                                  / subscription /
                                                  platform_fee

  `amount`                numeric                 Amount

  `payment_method`        payment_method          Payment method

  `reference_id`          text                    External/reference ID

  `description`           text                    Description

  `transaction_date`      timestamptz             Transaction time

  `created_at`            timestamptz             Creation time
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 22. Smart+ Subscriptions

## `subscription_plans`

Available shop subscription plans.

``` text
Free
Smart+
Smart+ Pro
```

  Column            Type          Description
  ----------------- ------------- -----------------------
  `id`              uuid PK       Plan ID
  `name`            text          Plan name
  `price`           numeric       Price
  `billing_cycle`   text          monthly / yearly
  `features`        jsonb         Feature configuration
  `is_active`       boolean       Plan status
  `created_at`      timestamptz   Creation time

------------------------------------------------------------------------

## `shop_subscriptions`

  Column                       Type          Description
  ---------------------------- ------------- ---------------------
  `id`                         uuid PK       Subscription ID
  `shop_id`                    uuid FK       Shop
  `plan_id`                    uuid FK       Subscription plan
  `status`                     text          Subscription status
  `razorpay_subscription_id`   text          Razorpay ID
  `started_at`                 timestamptz   Start
  `expires_at`                 timestamptz   Expiry
  `created_at`                 timestamptz   Creation time

------------------------------------------------------------------------

# 23. Promotional Boost

## `promotions`

Paid shop visibility/promotional campaigns.

  Column         Type          Description
  -------------- ------------- -----------------
  `id`           uuid PK       Promotion ID
  `shop_id`      uuid FK       Shop
  `name`         text          Campaign name
  `budget`       numeric       Campaign budget
  `start_date`   timestamptz   Start
  `end_date`     timestamptz   End
  `status`       text          Campaign status
  `created_at`   timestamptz   Creation time

------------------------------------------------------------------------

## `promotion_products`

Products included in a promotion.

  Column              Type      Description
  ------------------- --------- --------------
  `id`                uuid PK   ID
  `promotion_id`      uuid FK   Promotion
  `shop_product_id`   uuid FK   Shop product

Unique constraint:

``` text
(promotion_id, shop_product_id)
```

------------------------------------------------------------------------

# 24. Notifications

## `notifications`

Used by Customer, Rider and Shop Owner apps.

  Column         Type          Description
  -------------- ------------- -------------------
  `id`           uuid PK       Notification ID
  `user_id`      uuid FK       Recipient
  `type`         text          Notification type
  `title`        text          Title
  `message`      text          Message
  `data`         jsonb         Additional data
  `is_read`      boolean       Read state
  `created_at`   timestamptz   Creation time

Examples:

``` text
Customer:
"Your rider has picked up your order."

Rider:
"New delivery available."

Shop Owner:
"New order received."

Shop Owner:
"Monitor stock is running low."
```

------------------------------------------------------------------------

# 25. Shop Bank Accounts

## `shop_bank_accounts`

Used by the shop owner's Bank Details section.

  Column                  Type          Description
  ----------------------- ------------- -----------------
  `id`                    uuid PK       Account ID
  `shop_id`               uuid FK       Shop
  `account_holder_name`   text          Account holder
  `bank_name`             text          Bank
  `account_number`        text          Account number
  `ifsc_code`             text          IFSC
  `upi_id`                text          UPI ID
  `is_primary`            boolean       Primary account
  `created_at`            timestamptz   Creation time

> In production, sensitive financial information should be handled
> carefully and access should be restricted.

------------------------------------------------------------------------

# 26. Dashboard Data Mapping

  Dashboard Feature     Main Tables
  --------------------- ---------------------------------------------
  Revenue This Month    `orders`, `transactions`
  Products Listed       `shop_products`
  Platform Views        `shop_views`
  Active Reservations   `reservations`
  Revenue Overview      `transactions`
  Category Split        `categories`, `order_items`
  Recent Reservations   `reservations`
  Low Stock Alert       `shop_products`
  Stock Manager         `shop_products`, `inventory_movements`
  AI Bill Scanner       `scanned_invoices`, `scanned_invoice_items`
  Purchase Invoice      `documents`
  Proforma              `documents`
  Quotation             `documents`
  Bank Ledger           `transactions`
  Expenses              `expenses`
  P&L Report            `transactions`, `expenses`
  Bank Details          `shop_bank_accounts`
  Store Settings        `shops`
  Smart+                `subscription_plans`, `shop_subscriptions`
  Promotional Boost     `promotions`, `promotion_products`

------------------------------------------------------------------------

# 27. Location Architecture

NearBuy is location-based, so PostGIS is used for:

``` text
shops.location
addresses.location
riders.current_location
rider_locations.location
```

This allows queries such as:

``` text
Find shops within 5 km of customer
```

and:

``` text
Sort shops by distance
```

The core discovery query should eventually be implemented as a
PostgreSQL function/RPC rather than fetching every shop to the frontend.

------------------------------------------------------------------------

# 28. Core NearBuy Relationships

## Customer → Shop → Product

``` text
Customer
    |
    v
Search
    |
    v
Product
    |
    v
Shop Product
    |
    v
Shop
```

## Customer → Order → Rider

``` text
Customer
    |
    v
Order
    |
    v
Delivery
    |
    v
Rider
```

## Rider → Customer Live Tracking

``` text
Rider GPS
    |
    v
rider_locations
    |
    v
Supabase Realtime
    |
    v
Customer Map
```

## Shop → Inventory

``` text
Shop
 |
 v
shop_products
 |
 +---- Product
 |
 +---- Price
 |
 +---- Quantity
 |
 +---- Availability
```

------------------------------------------------------------------------

# 29. MVP Tables

For the first working prototype, prioritize these tables:

``` text
profiles
addresses

shops
shop_hours

categories
products
shop_products

searches
search_results

reservations
reservation_items

orders
order_items
payments

riders
deliveries
rider_locations
delivery_status_history
```

After the core flow works, add:

``` text
reviews
inventory_movements
shop_views

documents
document_items

scanned_invoices
scanned_invoice_items

expenses
transactions

subscription_plans
shop_subscriptions

promotions
promotion_products

notifications
shop_bank_accounts
```

------------------------------------------------------------------------

# 30. Recommended Development Order

``` text
PHASE 1 — Authentication
    |
    +--> Supabase Auth
    +--> profiles
    |
    +--> Customer login
    +--> Rider login
    +--> Shop Owner login


PHASE 2 — Shops & Products
    |
    +--> shops
    +--> categories
    +--> products
    +--> shop_products
    |
    +--> Shop Owner inventory


PHASE 3 — Search
    |
    +--> searches
    +--> search_results
    |
    +--> Text search
    +--> Snap search
    +--> Voice search


PHASE 4 — Reservation & Orders
    |
    +--> reservations
    +--> orders
    +--> payments


PHASE 5 — Rider
    |
    +--> riders
    +--> deliveries
    +--> rider_locations
    +--> delivery_status_history
    |
    +--> Supabase Realtime
    +--> Live customer tracking


PHASE 6 — Shop Management
    |
    +--> inventory_movements
    +--> documents
    +--> scanned_invoices
    +--> expenses
    +--> transactions


PHASE 7 — Business Features
    |
    +--> Smart+
    +--> Promotions
    +--> Analytics
    +--> Notifications
```

------------------------------------------------------------------------

# 31. Important Design Decisions

### 1. Use Supabase Auth

Do not create a custom password/login table.

``` text
auth.users
    ↓
profiles
```

### 2. Use `shop_products`

Do not put price and stock directly into `products`.

``` text
Product
    ↓
Shop Product
    ↓
Shop-specific price + stock
```

### 3. Use PostGIS

Nearby-shop discovery is a core NearBuy feature.

### 4. Use Supabase Realtime

Useful for:

-   Rider GPS
-   Order status
-   Reservation status
-   Notifications
-   Shop order updates

### 5. Keep historical prices

`order_items.unit_price` should represent the price at the time of
purchase.

### 6. Keep inventory history

`inventory_movements` makes stock changes auditable.

### 7. Protect data with RLS

Customers should only access their own:

``` text
addresses
searches
orders
payments
notifications
```

Riders should access their own:

``` text
deliveries
locations
rider profile
```

Shop owners should only access data belonging to their shops.

------------------------------------------------------------------------

# 32. Final Schema

``` text
AUTH
├── auth.users
└── profiles
    └── addresses


SHOP
├── shops
├── shop_hours
├── shop_bank_accounts
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
│
├── reservations
│   └── reservation_items
│
├── orders
│   └── order_items
│
├── payments
└── reviews


RIDER
├── riders
├── deliveries
│   └── delivery_status_history
└── rider_locations


SHOP MANAGEMENT
├── shop_views
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

This structure is intended as the database blueprint corresponding to
the NearBuy prototype and feature set described in the project material,
including AI Product Finder, NearBuy Rider, Smart+ for Shopkeepers,
inventory, billing, analytics and payments.
