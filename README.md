# Stock & Revenue Management System with Invoice Scanner

A full-stack **Business Management Web App** built with **Next.js**, **React**, **TypeScript**, and **MySQL**.  
It helps businesses manage products, inventory, sales, and discounts, **with an AI-powered Vietnamese invoice scanner** to automatically extract and process bill data.

---

## Features

### 1. Invoice Scanner (Highlight Feature)
- Upload Vietnamese bills or invoices in **image or PDF format**.
- Automatically extracts structured data:
  - Customer name
  - Product list (name, quantity, price)
  - Total price
  - Date & time
- Supports **batch scanning** for multiple invoices.
- Reduces manual data entry and human error.
- Integrated with sales and inventory modules to update stock and transactions automatically.

### 2. Product & Inventory Management
- Add, update, and delete products.
- Track real-time stock levels.
- Record inventory transactions (restock and sales).
- Automatically adjusts stock quantities when orders are processed.

### 3. Discounts & Promotions
- Create discounts for products, categories, or both.
- Supports **percentage** and **fixed amount** discounts.
- Define usage limits, discount limits, and active periods.
- Tracks usage of discounts for better reporting.

### 4. Sales & Transactions
- Record sales transactions with detailed product info.
- Automatic calculation of total revenue.
- Generate unique transaction IDs.
- Order status tracking: `pending`, `cooking`, `complete`.

### 5. Frontend
- Dynamic tables, forms, and modals for managing products, discounts, and sales.
- Status indicators and user-friendly alerts.
- Currency formatted in **Vietnamese Dong (VND)**.
- Clean UI with Tailwind CSS and Lucide React icons.

### 6. Backend
- RESTful APIs for CRUD operations on products, discounts, and transactions.
- Handles discount logic, inventory updates, and invoice scanning.
- Optimized MySQL database design with proper relationships.

---

## Live Demo

Access the app here: [Business Management App](https://business-management-app-3z33.vercel.app/)

## API Endpoints (Examples)

| Method | Endpoint                       | Description                           |
|--------|--------------------------------|---------------------------------------|
| POST   | `/api/action/add_discount`      | Add or update a discount              |
| GET    | `/api/discounts`               | List discounts with pagination        |
| POST   | `/api/action/sell_products`    | Process a sale transaction            |
| POST   | `/api/action/scan_invoice`     | Scan and extract data from a bill     |
| POST   | `/api/action/delete_discount`  | Delete a discount                     |

---

## Notes
- All currency is displayed in **Vietnamese Dong (VND)**.
- Discounts can apply to **products, categories, or both**.
- Inventory automatically updates after sales or restocks.
- The invoice scanner reduces manual data entry and integrates directly with the sales system.

---

## License
MIT License © 2025 [Your Name]
