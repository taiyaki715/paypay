# Project Overview

## Project Name
paypay - Personal Finance and Transaction Management Application

## Purpose
A web application for managing PayPay transactions, categorizing expenses, and tracking budgets. The app allows users to:
- Import and manage transactions
- Categorize transactions
- Set monthly budgets per category
- Track spending against budgets
- Exclude transactions from calculations

## Tech Stack
- **Framework**: Next.js 15.5.6 (with Turbopack)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL with ssr/supabase-js)
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI primitives
- **Data Tables**: TanStack React Table 8
- **Linter/Formatter**: Biome 2.2.0
- **Validation**: Zod 4.1.12

## Database Schema
- **categories**: id, name, monthly_budget, created_at, updated_at
- **transactions**: id, merchant, transaction_date, withdrawal_amount, deposit_amount, category_id, is_excluded, and more

## Key Features
- CSV transaction import
- Category management with budgets
- Transaction categorization
- Exclude transactions from calculations
- Budget tracking and progress visualization
