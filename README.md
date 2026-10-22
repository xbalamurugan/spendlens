# SpendLens Insights

# SpendLens — Lovable Build Prompt

Copy everything below into Lovable as your starting prompt.

---

Build a personal finance / expense-tracking web app called **SpendLens**.

## Design System

- **Primary color:** Indigo/Violet `#5B4FE9` (buttons, active tabs, links, chart lines)
- **Background:** very light gray-blue `#F5F6FA`
- **Cards:** white, `rounded-xl`, subtle border (`#E5E7EB`), soft shadow, generous padding (24-32px)
- **Typography:** clean modern sans-serif (Inter or similar). Large bold serif-free wordmark "SpendLens" in the primary color as the logo/header.
- **Text hierarchy:** dark gray `#111827` for headings/values, medium gray `#6B7280` for labels/secondary text
- **Accent colors for data:** deep orange/rust for one donut segment, indigo shades for others, red `#EF4444` for negative/error states, green or indigo for positive amounts
- **Buttons:** solid indigo, white uppercase-ish text, rounded, full-width on forms
- **Spacing:** generous whitespace, minimalist, no clutter
- **Style:** modern fintech dashboard aesthetic — think Mint/Copilot Money, not spreadsheet-like

## Global Layout

- Top navbar (post-login): "SpendLens" logo (left, indigo), center/left nav links — **Dashboard, Transactions, Categories, Trends** — active link underlined in indigo, bold. Right side: notification bell icon + user/account icon.
- Auth pages have no navbar — just the centered logo above a white card on the light background.
- Fully responsive, mobile-first.

## Pages

### 1. Login / Sign Up (single card, tabbed)
- Centered white card, ~460px wide, on the light background
- Two tabs at the top: **LOG IN** / **SIGN UP**, active tab underlined in indigo
- **Log In tab:** Email field, Password field (dots masked), a "Forgot?" link aligned right above/near the password field, primary button (label changes to "LOGGING IN" with a spinner icon while submitting), "Continue as guest" link centered below
- **Sign Up tab:** Full Name, Email, Password fields, primary button "CREATE ACCOUNT", same "Continue as guest" link below
- Include inline field validation: e.g. show a red-underlined input with a small error icon + message ("Invalid email format") below an invalid email field
- Placeholder text: "John Doe" for name, "your@email.com" for email

### 2. Dashboard
- Page header via navbar (Dashboard tab active)
- Row of 3 summary cards:
  1. **Total Spent This Month** — large dollar figure + small colored percentage-change pill (e.g. "+12%")
  2. **Top Category** — category name + amount (e.g. "Dining Out $850.00")
  3. **Savings Goal Progress** — big percentage, a status pill ("On track"), and a horizontal progress bar underneath
- Below, two side-by-side cards:
  - **Category Breakdown**: a donut/ring chart with a center label showing "Top" + the leading category name
  - **6 Month Trend**: a filled line chart (area under the line lightly shaded in indigo) with month labels on the x-axis (Jan–Jun)
- Floating/bottom-right primary button "+ Add expense" that opens the Add Expense modal

### 3. Transactions
- Page title "Transactions"
- Filter row: a date-range picker pill (e.g. "Oct 1 - Oct 31, 2024" with calendar icon) and a category filter dropdown pill ("All Categories"), plus a "Clear filters" text link aligned right
- A clean table/list with columns: **Date, Category (as a rounded pill/badge), Note, Amount**
- Amounts: red/dark text with "-$" for expenses, indigo/blue with "+$" for income
- Rows separated by thin dividers, no heavy borders

### 4. Add Expense (modal/dialog)
- Modal title "Add Expense" with a close (X) icon top-right
- **Amount**: large "$" + large "0.00" numeric input, minimal underline style
- **Category**: pill/chip selector with options like Food & Drink, Transport, Shopping, Bills — selected pill filled indigo, others outlined
- **Date**: text/date input showing current date format (MM/DD/YYYY)
- **Note (optional)**: text input, placeholder "What was this for?"
- Full-width primary button "Save Expense" at the bottom

### 5. Categories
- Page title "Category Breakdown" + subtitle "Analyze your spending distribution."
- Toggle top-right: "This Month" / "Last Month" (segmented control, active state highlighted)
- An **insight banner** below the toggle: light indigo-tinted background, bold "Insight:" label in indigo followed by a plain-text observation (e.g. spending vs. typical average)
- Two-column layout below:
  - Left: large donut chart card with a centered "TOTAL" label and dollar amount
  - Right: a "CATEGORIES" list card — each row has a colored dot, category name, percentage (bold, right-aligned), and dollar amount below the percentage, divided by thin lines

### 6. Trends
- Page title "Spending Trends" + subtitle "Your overall expenditure over time."
- Top-right segmented time-range control: **3M / 6M / 1Y / ALL**
- A large line chart, indigo line, month labels on x-axis, dollar labels on y-axis (formatted as $1k, $2k, etc.)
- On hover, show a tooltip card with the month + exact dollar value
- Below the chart, a small insight line with a trend arrow icon (up/down) summarizing the trend direction and average spend

## States & Interactions to include
- Loading spinner state on the login button while "authenticating"
- Inline validation errors on form fields (red text + icon)
- Empty states for Transactions (friendly message + icon if no results match filters)
- Smooth hover states on nav links, buttons, and table rows
- Mobile: collapse the top nav into a hamburger or bottom tab bar; stack dashboard cards vertically; make charts horizontally scrollable if needed

## Tech
- React + Tailwind CSS
- Use a charting library (e.g. Recharts) for the donut and line charts
- Component-based structure: separate components for Navbar, SummaryCard, DonutChart, TrendChart, TransactionRow, CategoryRow, AddExpenseModal, AuthCard

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://spendlens-clearview-tracker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dc7cdcfa-779e-4b0e-aac8-5d79d07a45be).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
