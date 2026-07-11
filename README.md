# VoiceReceipt

VoiceReceipt is a local-first business management tool for small businesses that sell through WhatsApp, cash, transfer, POS, or informal credit.

It helps a business owner create receipts by voice, track customer debt, record part payments, send WhatsApp reminders, manage expenses, remember product types, and export business records.

## Why this exists

Many small businesses do not need a full accounting system. They need a fast way to answer:

* Who bought something?
* What did they buy?
* How much was the sale?
* How much did they pay?
* Who still owes money?
* How much cash came in today?
* What expenses reduced the business cash?
* Can I send the customer proof or a reminder on WhatsApp?

VoiceReceipt turns those workflows into a lightweight web app.

## Core Features

### Voice-to-receipt creation

Create receipts through a guided flow:

1. Customer name
2. Customer WhatsApp number
3. Items bought
4. Total amount
5. Amount paid

The app generates a clean receipt with:

* Business details
* Customer details
* Receipt number
* Items
* Total amount
* Amount paid
* Outstanding balance
* Payment status

Receipts can be exported as:

* PNG image
* PDF

### Business profile

Save business details once:

* Business name
* Business phone
* Business address

These details automatically appear on every receipt.

### Customer debt tracking

Every saved receipt updates customer balances automatically.

Example:

```txt
Ada bought goods worth ₦18,000
Paid ₦10,000
Outstanding balance: ₦8,000
```

VoiceReceipt tracks:

* Total bought
* Paid on receipts
* Extra part payments
* Current outstanding balance
* Number of receipts
* Number of payments

### Customer ledger

Each customer gets a dedicated ledger page showing:

* Current balance
* Purchase history
* Receipt history
* Part payment history
* WhatsApp reminder action
* Receipt export actions

### Partial payments

Record repayments without creating fake new sales.

Example:

```txt
Ada owes ₦8,000
Ada pays ₦3,000
New balance: ₦5,000
```

Each recorded payment creates a part-payment receipt showing:

* Payment amount
* Previous balance
* Outstanding balance
* Payment number
* Date
* Optional note

### WhatsApp reminders

Save customer WhatsApp numbers and send reminders directly to the customer.

Supported WhatsApp actions:

* Send receipt message
* Send debt reminder
* Send part-payment receipt

Nigerian phone numbers like `08012345678` are normalized for WhatsApp links.

### Dashboard

The dashboard gives a clean business summary:

* Today’s sales
* Today’s cash collected
* Today’s expenses
* Today’s net cash
* Outstanding debt
* Receipt count
* Customers owing

It also shows all-time business totals.

### Expenses

Track business spending:

* Stock
* Transport
* Rent
* Utilities
* Packaging
* Staff
* Food
* Repairs
* Marketing
* General expenses

Expenses reduce net cash on the dashboard.

### Product memory

VoiceReceipt remembers product types mentioned during receipt creation.

Example:

```txt
Two chargers and one earpiece
```

The app can auto-add:

* Chargers
* Earpiece

This is not inventory counting. It is a lightweight catalog of what the business sells.

### Exportable records

Export business data as CSV:

* Receipts
* Customers
* Payments
* Expenses
* Products

Useful for backup, reporting, accountant review, or business analysis.

## Pages

```txt
/              Landing page
/dashboard     Sales, cashflow, and debt summary
/create        Voice-guided receipt creation
/receipts      Saved receipt history
/customers     Customer debt overview
/customers/[name] Customer ledger
/expenses      Expense tracking
/products      Product memory/catalog
/exports       CSV exports
/settings      Business profile and local data controls
```

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* LocalStorage
* Web Speech API
* html-to-image
* jsPDF
* lucide-react

## Local-first data model

VoiceReceipt currently stores data in the browser using `localStorage`.

Stored data includes:

* Business profile
* Receipts
* Customer contacts
* Customer payments
* Expenses
* Product catalog

This keeps the MVP simple and fast. A production version should move this data to a backend such as Supabase, Neon, Firebase, or a custom API.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## Recommended Browser

Use Chrome or Edge for the best voice input support.

The app uses the browser Web Speech API, which is not equally supported across all browsers.

## Current Limitations

* Data is stored locally in the browser.
* Clearing browser storage deletes app records.
* Voice recognition quality depends on browser and microphone support.
* No authentication yet.
* No cloud sync yet.
* Product memory is lightweight and does not track stock quantities.
* No multi-business or multi-user support yet.

## Future Improvements

High-priority upgrades:

* Supabase backend
* User authentication
* Cloud sync
* Multi-device access
* Business subscription plans
* Customer statement export
* Monthly PDF reports
* Better product parsing
* Optional inventory quantity tracking
* Offline-first PWA support
* Data import/export backup file
* Role-based staff accounts

## Monetization Direction

Potential paid features:

* Unlimited receipts
* Branded receipts
* Customer debt ledger
* WhatsApp reminder templates
* Monthly business reports
* CSV/PDF exports
* Cloud backup
* Multi-device sync
* Staff accounts

Suggested pricing target:

```txt
₦15,000/year
```

This positions VoiceReceipt as an affordable business utility for Nigerian micro-businesses and solo sellers.

## Project Status

MVP in active development.

The current version demonstrates the full business loop:

```txt
Voice input → receipt → customer debt → WhatsApp reminder → payment update → dashboard/reporting
```
