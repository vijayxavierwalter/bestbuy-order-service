# Best Buy Order Service

## Overview

The **Order Service** is a microservice in the Best Buy Cloud-Native Application.
It provides a REST API for submitting and retrieving customer orders.

This service is used by:

* **Store-Front** → to submit customer orders
* **Store-Admin** → to view order information
* **Makeline-Service** → to process and update order status

---

## Responsibilities

* Create new orders
* Retrieve all orders
* Retrieve a single order by ID
* Update order status
* Support order processing workflow

---

## Tech Stack

* **Node.js**
* **Fastify**
* **Docker**

---

## Notes

This service was adapted from a lab starter project and customized for the Best Buy Cloud-Native Application final project.

---

## Running Locally

### Prerequisites

* Node.js installed
* npm installed

### Install dependencies

```bash
npm install
```

### Run the service

```bash
npm run dev
```

The service will run locally on:

```text
http://localhost:3000
```

---

## Testing

You can test the API using the `test-order-service.http` file in the root of the repository.

---

## Deployment

This service is:

* Containerized using Docker
* Deployed to **Azure Kubernetes Service (AKS)**
* Integrated with the other Best Buy microservices

---

## Related Services

* **store-front** – Customer web application
* **store-admin** – Admin dashboard
* **product-service** – Product catalog API
* **makeline-service** – Background order processor
