# Backend Architecture - Repository Pattern dengan Clean Architecture

## Overview

Project ini telah menerapkan **Repository Pattern** dengan **Clean Architecture** untuk meningkatkan maintainability, testability, dan scalability.

## Arsitektur Flow

```
Request → Router → Validator → Controller → Service → Repository → Database
```

### Layer Breakdown:

1. **Router** (`/routers`)
   - Mendefinisikan endpoint API
   - Menerapkan middleware (authentication, validation)
   - Meneruskan request ke Controller

2. **Validator** (`/helpers/validator.js`)
   - Validasi input menggunakan express-validator
   - Validasi format data sebelum masuk ke Controller

3. **Controller** (`/controllers`)
   - Menangani HTTP request/response
   - Parsing request parameters
   - Format response (status code, message, data)
   - Error handling untuk HTTP layer
   - **Tidak mengandung business logic**

4. **Service** (`/services`)
   - Mengandung business logic
   - Orchestrasi antara multiple repositories
   - Validasi business rules
   - Transaction management
   - **Tidak mengandung database queries**

5. **Repository** (`/repositories`)
   - Mengandung database operations
   - CRUD operations
   - Complex queries
   - **Satu repository per table/entity**

6. **Database** (`/database`)
   - MySQL connection pool
   - Database configuration

## Struktur Folder

```
backend/
├── controllers/              # HTTP layer
│   ├── users/
│   │   ├── users.js         # ✅ Refactored to use Service
│   │   ├── profiles.js
│   │   ├── address.js
│   │   └── wishlist.js
│   ├── products/
│   ├── blog/
│   └── transactions/
├── services/                # Business logic layer
│   ├── users/
│   │   ├── UserService.js         # ✅ Implemented
│   │   ├── ProfileService.js      # ✅ Implemented
│   │   ├── AddressService.js      # ✅ Implemented
│   │   ├── WishlistService.js     # ✅ Implemented
│   │   ├── SubscribeService.js    # ✅ Implemented
│   │   └── index.js
│   ├── products/
│   ├── blog/
│   └── transactions/
├── repositories/            # Data access layer
│   ├── BaseRepository.js         # ✅ Base class untuk CRUD
│   ├── users/
│   │   ├── UserRepository.js              # ✅ Implemented
│   │   ├── UserKtpRepository.js           # ✅ Implemented
│   │   ├── UserAddressRepository.js       # ✅ Implemented
│   │   ├── StoreRepository.js             # ✅ Implemented
│   │   ├── StoreAddressRepository.js      # ✅ Implemented
│   │   ├── UserBankAccountRepository.js   # ✅ Implemented
│   │   ├── WishlistRepository.js          # ✅ Implemented
│   │   ├── SubscribeRepository.js         # ✅ Implemented
│   │   └── index.js
│   ├── products/
│   ├── blog/
│   └── transactions/
├── routers/                # Route definitions
├── helpers/                # Utility functions
└── database/               # Database connection
```

## BaseRepository

`BaseRepository` adalah class dasar yang menyediakan operasi CRUD umum:

```javascript
class BaseRepository {
  constructor(tableName, primaryKey = 'id')

  // Methods:
  async findAll(options)        // Get all records dengan filter
  async findById(id)            // Get by ID
  async findOne(where)          // Get single record
  async create(data)            // Insert record
  async createMany(dataArray)   // Bulk insert
  async update(id, data)        // Update by ID
  async updateWhere(where, data) // Update dengan kondisi
  async delete(id)              // Delete by ID
  async deleteWhere(where)      // Delete dengan kondisi
  async count(where)            // Count records
  async exists(where)           // Check existence
  async rawQuery(query, params) // Custom query
  async transaction(callback)   // Transaction support
}
```

## Contoh Implementasi - Users Module

### 1. Repository Layer

```javascript
// repositories/users/UserRepository.js
class UserRepository extends BaseRepository {
  constructor() {
    super('users', 'id');
  }

  async findByUsername(username) {
    return this.findOne({ username });
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async getUsersWithDetails(filters, pagination) {
    // Complex query dengan JOIN
    const query = `
      SELECT u.*, uk.full_name, ua.city
      FROM users u
      LEFT JOIN user_ktp uk ON u.id = uk.user_id
      LEFT JOIN user_address ua ON u.main_address_id = ua.id
      WHERE ...
    `;
    return this.rawQuery(query, params);
  }
}
```

### 2. Service Layer

```javascript
// services/users/UserService.js
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.userKtpRepository = new UserKtpRepository();
  }

  async registerUser(userData) {
    // Business logic validation
    const existingUser = await this.userRepository
      .findByUsernameOrEmail(username, email);

    if (existingUser) {
      throw new Error('Username or email already used');
    }

    // Hash password
    const hashPass = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user (repository call)
    const newUser = await this.userRepository.create({
      username,
      password: hashPass,
      email,
      role_id: roleId,
    });

    // Create user profile
    await this.userKtpRepository.createForUser(newUser.id);

    // Send email
    await sendVerificationEmail(email, token);

    return newUser;
  }
}
```

### 3. Controller Layer

```javascript
// controllers/users/users.js
const { UserService } = require('../../services/users');
const userService = new UserService();

module.exports = {
  register: async (req, res) => {
    const { username, password, email, roleId } = req.body;

    // Input validation
    const errorValidator = validationResult(req);
    if (!errorValidator.isEmpty()) {
      return res.status(422).send({
        status: 'fail',
        message: { errors: errorValidator.array()[0].msg },
      });
    }

    try {
      // Call service
      const result = await userService.registerUser({
        username, password, email, roleId
      });

      // Format response
      res.status(200).send({
        status: 'success',
        message: 'Registration successful.',
        data: result,
      });
    } catch (error) {
      // Error handling
      const statusCode = error.message === 'Username or email already used'
        ? 422 : 500;
      res.status(statusCode).send({
        status: 'fail',
        message: error.message,
      });
    }
  }
};
```

## Keuntungan Arsitektur Ini

### 1. Separation of Concerns
- Controller: HTTP layer
- Service: Business logic
- Repository: Data access
- Setiap layer punya tanggung jawab yang jelas

### 2. Testability
- Mudah untuk unit test karena layer terpisah
- Bisa mock repository di service test
- Bisa mock service di controller test

### 3. Reusability
- Repository methods bisa digunakan di multiple services
- Service methods bisa digunakan di multiple controllers
- BaseRepository menyediakan CRUD umum

### 4. Maintainability
- Perubahan database query hanya di repository
- Perubahan business logic hanya di service
- Perubahan response format hanya di controller

### 5. Scalability
- Mudah menambah module baru
- Mudah menambah feature baru
- Pattern yang konsisten

## Status Implementasi

### ✅ Completed

- [x] BaseRepository dengan CRUD operations
- [x] Users Module Repositories (8 repositories)
- [x] Users Module Services (5 services)
- [x] Users Controller refactoring (main controller)

### 🚧 In Progress

- [ ] Products Module (Repositories, Services, Controllers)
- [ ] Blog Module (Repositories, Services, Controllers)
- [ ] Transactions Module (Repositories, Services, Controllers)
- [ ] Complete refactoring untuk remaining controllers:
  - [ ] profiles.js
  - [ ] address.js
  - [ ] wishlist.js
  - [ ] subscribe.js

## Best Practices

### 1. Controller
```javascript
// ✅ Good - Thin controller
async getUser(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).send({ status: 'success', data: user });
  } catch (error) {
    res.status(500).send({ status: 'fail', message: error.message });
  }
}

// ❌ Bad - Business logic di controller
async getUser(req, res) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const result = await db.query(query, [req.params.id]);
  if (result.length === 0) {
    return res.status(404).send({ message: 'Not found' });
  }
  // ... more logic
}
```

### 2. Service
```javascript
// ✅ Good - Business logic di service
async registerUser(userData) {
  // Validate business rules
  if (await this.userRepository.exists({ email: userData.email })) {
    throw new Error('Email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create user
  return this.userRepository.create({
    ...userData,
    password: hashedPassword
  });
}

// ❌ Bad - Direct database access
async registerUser(userData) {
  const query = 'INSERT INTO users VALUES (?, ?, ?)';
  return db.query(query, [userData.username, userData.password, userData.email]);
}
```

### 3. Repository
```javascript
// ✅ Good - Data access only
async findByEmail(email) {
  return this.findOne({ email });
}

async getUserWithProfile(userId) {
  const query = `
    SELECT u.*, p.*
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE u.id = ?
  `;
  return this.rawQuery(query, [userId]);
}

// ❌ Bad - Business logic di repository
async findByEmail(email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('User not found'); // Business logic!
  }
  delete user.password; // Business logic!
  return user;
}
```

## Error Handling

### Service Layer
```javascript
// Throw descriptive errors
throw new Error('User not found');
throw new Error('Email already exists');
throw new Error('Insufficient permissions');
```

### Controller Layer
```javascript
// Map errors to HTTP status codes
try {
  await service.doSomething();
} catch (error) {
  let statusCode = 500;
  if (error.message === 'Not found') statusCode = 404;
  if (error.message.includes('already exists')) statusCode = 422;
  if (error.message.includes('permission')) statusCode = 403;

  res.status(statusCode).send({
    status: 'fail',
    message: error.message
  });
}
```

## Migration Guide

Untuk module yang belum di-refactor, ikuti langkah berikut:

### 1. Buat Repository
```javascript
// repositories/products/ProductRepository.js
const BaseRepository = require('../BaseRepository');

class ProductRepository extends BaseRepository {
  constructor() {
    super('products', 'id');
  }

  // Add custom methods
  async findByCategory(categoryId) {
    return this.findAll({ where: { category_id: categoryId } });
  }
}

module.exports = ProductRepository;
```

### 2. Buat Service
```javascript
// services/products/ProductService.js
const { ProductRepository } = require('../../repositories/products');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProducts(filters) {
    // Business logic here
    return this.productRepository.findAll(filters);
  }
}

module.exports = ProductService;
```

### 3. Refactor Controller
```javascript
// controllers/products/products.js
const { ProductService } = require('../../services/products');
const productService = new ProductService();

module.exports = {
  getProducts: async (req, res) => {
    try {
      const products = await productService.getProducts(req.query);
      res.status(200).send({ status: 'success', data: products });
    } catch (error) {
      res.status(500).send({ status: 'fail', message: error.message });
    }
  }
};
```

## Next Steps

1. Complete Users module refactoring (remaining controllers)
2. Implement Products module (Repositories → Services → Controllers)
3. Implement Blog module (Repositories → Services → Controllers)
4. Implement Transactions module (Repositories → Services → Controllers)
5. Add unit tests for services
6. Add integration tests for repositories
7. Update API documentation

## Resources

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated:** 2025-11-08
**Author:** Claude Code
**Version:** 1.0.0
