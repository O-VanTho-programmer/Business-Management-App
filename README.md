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

## Notes
- All currency is displayed in **Vietnamese Dong (VND)**.
- Discounts can apply to **products, categories, or both**.
- Inventory automatically updates after sales or restocks.
- The invoice scanner reduces manual data entry and integrates directly with the sales system.

---
## Invoice Scanner (OCR)

Our project includes an AI-powered invoice scanner that automatically extracts structured data from invoices, such as:

- Customer name
- Product list
- Quantity and unit price
- Total amount

It is optimized for Vietnamese invoices and can process both image (JPG, PNG) and PDF formats.

### How it Works

1. **Backend OCR API (Flask + Ngrok)**  
   - The Colab notebook runs a Flask server and exposes it through an Ngrok tunnel.  
   - The Flask API listens for **POST** requests containing invoice images.  
   - When a request is received, the Colab notebook processes the image using an OCR model and extracts the data.

2. **Frontend Request Flow (React)**  
   - The React app collects invoice images from users.  
   - It sends a **POST** request to the Flask API via the Ngrok URL.  
   - The API responds with structured invoice data (JSON), which the frontend displays or saves.

3. **Benefits**  
   - No need for local OCR setup; all processing happens on Colab.  
   - Easy to integrate with your web or desktop application.  
   - Supports experimentation with different OCR models in Colab.

### How to Use

1. **Open the Notebook**  
   [Open in Google Colab](https://colab.research.google.com/github/O-VanTho-programmer/Business-Management-App/blob/main/InvoiceScanner.ipynb)

2. **Run the Flask + Ngrok Server**  
   - Execute the cells in order.  
   - The Ngrok URL will be displayed after startup.

3. **Send Invoice Data from Frontend**  
   - Use the Ngrok URL to send **POST** requests with invoice images.  
   - The OCR API will return structured data in JSON format.

4. **View Results**  
   - Extracted invoice information can be displayed in tables, JSON, or exported to your system.

### Notes
- GPU acceleration in Colab is optional but recommended for faster OCR processing.  
- You can fork the notebook to modify or experiment with the OCR pipeline.  

### Contact
If you encounter any issues or have questions about the invoice scanner, feel free to contact me at: **ovantho094@gmail.com**
