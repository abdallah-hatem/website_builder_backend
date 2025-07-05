# NestJS API with Prisma and Repository Pattern

A NestJS application built with PostgreSQL, Prisma ORM, and repository pattern.

## Features

- NestJS framework
- PostgreSQL database with Docker
- Prisma ORM
- Repository pattern implementation
- Swagger API documentation
- User management CRUD operations
- TypeScript
- Input validation with class-validator

## Prerequisites

- Node.js (18+ recommended)
- Docker and Docker Compose
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the PostgreSQL database:
```bash
docker-compose up -d postgres
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. (Optional) Seed the database:
```bash
npm run db:seed
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### With Docker
```bash
docker-compose up
```

## API Documentation

Once the application is running, visit:
- API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api

## Available Scripts

- `npm run start:dev` - Start in development mode with file watching
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

## Project Structure

```
src/
├── common/
│   └── interfaces/
│       └── repository.interface.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── users/
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   └── users.module.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestjs_app"
PORT=3000
NODE_ENV=development
```

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## License

This project is licensed under the MIT License. 