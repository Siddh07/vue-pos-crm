# Vue POS & CRM System

A modern Point of Sale (POS) and Customer Relationship Management (CRM) web application built with **Vue 3**, **TypeScript**, **Vite**, **Pinia**, and **Tailwind CSS**.

## Features

- **Dashboard**: Quick metrics overview, recent transactions, and revenue stats.
- **POS Terminal**: Fast item selection, real-time cart calculation, tax, discount, and seamless checkout.
- **CRM & Customer Directory**: Customer profile management, transaction history, and loyalty tracking.
- **State Management**: Centralized reactive state powered by Pinia.
- **Modern UI**: Styled with Tailwind CSS for a sleek, responsive interface.

## Tech Stack

- **Framework**: Vue 3 (Composition API `<script setup>`)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Language**: TypeScript

## Getting Started

### Mock API backend

See [MockAPI setup](docs/mockapi-setup.md) for the `/customers` resource fields
and sample records. Configure `VITE_API_URL` in `.env.local` to connect the frontend to your MockAPI endpoint.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

### Build

Compile and minify for production:

```bash
npm run build
```

### Preview

After building, preview the production app locally:

```bash
npm run preview
```

Open the local URL printed in the terminal to view the app.
