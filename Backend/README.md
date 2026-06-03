# Plantsteller Backend API

Plant e-commerce backend built with Node.js, Express, and MongoDB.

## Features

- **User Authentication** - JWT-based auth with secure password hashing
- **Product Catalog** - Plant inventory management with categories and filters
- **Shopping Cart** - Add, update, remove items with persistence
- **Orders** - Order creation, status tracking, and history
- **Payments** - Stripe integration for secure transactions
- **Reviews & Ratings** - User reviews with ratings system
- **Community** - Plant care tips, discussion posts, expert advice
- **Chatbot** - AI-powered plant care recommendations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Payment**: Stripe
- **Validation**: express-validator

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/plantsteller
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_key_here
OPENAI_API_KEY=your_openai_key_here
```

### Development

Start the development server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Cancel order

### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook
- `GET /api/payments/:orderId` - Get payment status

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Community
- `GET /api/community/posts` - Get all posts
- `GET /api/community/posts/:id` - Get post details
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/comments` - Add comment
- `POST /api/community/expert-advice` - Get expert advice

### Chatbot
- `POST /api/chatbot/message` - Send chat message
- `POST /api/chatbot/care-recommendation` - Get plant care tips
- `GET /api/chatbot/history` - Get chat history

## Database Schema

### Users
```typescript
{
  name: string;
  email: string;
  password: string (hashed);
  role: 'user' | 'admin';
  address: Address;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Products
```typescript
{
  name: string;
  scientificName: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  careLevel: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}
```

## Error Handling

All errors are returned in standardized format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Environment Variables

See `.env.example` for all required variables.

## Testing

```bash
npm run test
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your hosting service (Heroku, AWS, DigitalOcean, etc.)

3. Set environment variables on your hosting platform

## License

MIT
