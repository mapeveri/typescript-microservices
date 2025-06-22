# Typescript-microservices

Implementing a simplified distributed e-commerce system with two microservices: **Order Service** and **Billing Service**, which communicate asynchronously via RabbitMQ.

## 🧩 Architecture Overview

- **Microservices:**
    - `Order Service`: Handles the order lifecycle
    - `Invoice Service`: Allows sellers to upload and send PDF invoices.
- **Asynchronous communication:** RabbitMQ
- **Database:** MongoDB
- **API:** RESTful
- **Framework** Nest.js
- **Testing** Vitest
- **Mutant testing** Stryker
- **Code quality** Prettier & ESLint 
- **Hexagonal architecture**
- **DDD (Tactical patterns)**
- **CQS (Command and query separation)**

## 🗒️ Testing strategy

Outside-in TDD.

---

## 🚀 Main Endpoints documentation

### Order Service (`http://localhost:4000/api`)

### Invoice Service (`http://localhost:5000/api`)

---

## ⚙️ Local Development Setup

### Requirements
- Node.js
- Docker & Docker Compose
- MongoDB Compass (optional, for DB inspection)
- Pnpm

### Environment Configuration

Copy .env.dist and create a `.env` file at the root to have the correct environment variables.

```bash
cp .env.dist .env
```

## ▶️ Running the Project

To spin up all services:

```bash
docker-compose up
```

This will start:

Order Service on http://localhost:4000/api

Invoice Service on http://localhost:5000

RabbitMQ management on http://localhost:15672 (default login: app/rabbit_app)

## 🧪 Useful Commands

Code formatting check

```bash
pnpm format-code-check
```

Linter check

```bash
pnpm linter-check
```

Run unit tests
```bash
pnpm test:unit
```

Run mutants
```bash
pnpm test:mutant
```
