# CRUD API (fastify-based)

---

## Endpoints

### `GET api/products`

Returns all products.  
**Response:**

- `200 OK` — list of all products

---

### `GET api/products/{productId}`

Fetches a specific product by ID.  
**Response:**

- `200 OK` — product record if found
- `400 Bad Request` — invalid `productId` (not UUID)
- `404 Not Found` — product not found

---

### `POST api/products`

Creates a new product record.  
**Request body (JSON):**

```json
{
  "name": "New Product",
  "description": "New Product Description",
  "price": 24,
  "category": "clothing",
  "inStock": true
}
```

**Response:**

- `201 Created` — newly created record
- `400 Bad Request` — missing required fields

---

### `PUT api/products/{productId}`

Updates an existing product record.  
**Response:**

- `200 OK` — updated record
- `400 Bad Request` — invalid UUID
- `404 Not Found` — product not found

---

### `DELETE api/products/{productId}`

Deletes a product by ID.  
**Response:**

- `204 No Content` — record deleted
- `400 Bad Request` — invalid UUID
- `404 Not Found` — product not found

---

### Invalid Endpoints

Any non-existing endpoit (e.g., `/some-non/existing/resource`)  
**Response:**

- `404 Not Found` — with a message

---

### Server Errors

If an internal error occurs during request processing:  
**Response:**

- `500 Internal Server Error` — with a message

---

## Environment Variables

### Example `.env.example`

```bash
PORT=4000
```

---

## Scripts

| Command               | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run start:dev`   | Starts the app in development mode using `nodemon` |
| `npm run start:prod`  | Builds and runs the production version             |
| `npm run test`        | Runs test of test scenarios (min 3)                |
| `npm run start:multi` | Starts multiple app instances with a load balancer |

---

## Installation & Usage

```bash
# Install dependencies
npm install

# Copy environment example and configure
cp .env.example .env

# Run in development
npm run start:dev

# Run in production
npm run start:prod

# Run in multi
npm run start:multi
```

---

## Data Structure

Each product object has the following structure:

```json
{
  "id": "uuid",
  "name": "string!", // required
  "description": "string!", // required
  "price": "number! (>0)", // required, must be > 0
  "category": "string!", // required
  "inStock": "boolean!" // required
}
```
