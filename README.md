# DemoWebShop Test Automation

A production-ready Playwright test automation framework for DemoWebShop e-commerce application built with TypeScript. This framework provides comprehensive E2E testing with Page Object Model architecture and best practices.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Page Object Model](#page-object-model)
- [Code Quality](#code-quality)
- [Coding Standards](#coding-standards)

## Features

- **TypeScript** - Full type safety with strict mode enabled
- **Page Object Model** - Maintainable and scalable test architecture
- **Fixture-based Architecture** - Reusable page components with dependency injection
- **DemoWebShop E2E Testing** - Complete guest checkout flow automation
- **Multi-browser Support** - Chrome, Firefox, and WebKit configurations
- **Environment Management** - Flexible `.env` configuration for different environments
- **Storage State Management** - Session clearing for clean test states
- **Code Quality** - ESLint + Prettier + Husky pre-commit hooks
- **Parallel Execution** - Fast test runs with configurable workers
- **Comprehensive Reporting** - HTML reports with traces, screenshots, and videos

## Prerequisites

- **Node.js** v20.x or later
- **npm** v10.x or later

## Installation

1. **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd playwright-scaffold
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Install Playwright browsers:**

    ```bash
    npx playwright install
    ```

4. **Set up environment variables:**

    ```bash
    cp env/.env.example env/.env.dev
    ```

    Edit `env/.env.dev` with your application's configuration.

## Project Structure

```
root/
├── env/                       # Environment configuration
│   ├── .env.example           # Template for environment variables
│   └── .env.dev               # Development environment (git-ignored)
│
├── fixtures/                  # Playwright test fixtures
│   ├── api/                   # API testing utilities
│   │   ├── api-request-fixture.ts  # API request fixture
│   │   ├── api-types.ts            # TypeScript types for API
│   │   ├── plain-function.ts       # Core API request function
│   │   └── schemas/                # Zod validation schemas
│   │       └── util/               # Common error schemas
│   │           └── errorResponseSchema.ts
│   └── pom/                   # Page Object fixtures
│       ├── page-object-fixture.ts  # Page object instantiation
│       └── test-options.ts         # Merged test fixtures (use this)
│
├── pages/                     # Page Object Model classes
│   └── demowebshop/           # DemoWebShop page objects
│       ├── cart.page.ts       # Shopping cart page
│       ├── checkout.page.ts   # Checkout process page
│       ├── home.page.ts       # Homepage
│       ├── login.page.ts      # Login/authentication page
│       └── product.page.ts    # Product browsing page
│
├── test-data/                 # Test data files
│   └── demowebshop/           # DemoWebShop test data
│       └── orderData.json     # Order and shipping information
│
├── tests/                     # Test specifications
│   └── demowebshop/           # DemoWebShop tests
│       └── e2e/               # End-to-end tests
│           └── place-order.spec.ts  # Guest checkout E2E test
│
├── .gitignore
├── .prettierrc                # Prettier configuration
├── eslint.config.mts          # ESLint configuration (flat config)
├── package.json
├── playwright.config.ts       # Playwright configuration
├── README.md
└── tsconfig.json              # TypeScript configuration
```

## Configuration

### Playwright Configuration

The `playwright.config.ts` file contains all test runner settings:

| Setting            | Local                   | CI                |
| ------------------ | ----------------------- | ----------------- |
| Parallel execution | Enabled                 | Enabled           |
| Workers            | Auto                    | 1                 |
| Retries            | 0                       | 2                 |
| Reporter           | HTML (opens on failure) | Blob + HTML       |
| Traces             | On first retry          | On first retry    |
| Screenshots        | On failure              | On failure        |
| Videos             | Retain on failure       | Retain on failure |

### Browser Projects

| Project    | Description          | Dependencies |
| ---------- | -------------------- | ------------ |
| `chromium` | Main tests on Chrome | None         |
| `firefox`  | Firefox tests        | None         |
| `webkit`   | Safari tests         | None         |

### Timeouts

| Timeout            | Value      |
| ------------------ | ---------- |
| Test timeout       | 60 seconds |
| Action timeout     | 10 seconds |
| Navigation timeout | 30 seconds |
| Expect timeout     | 10 seconds |

## Environment Variables

### Setup

1. Copy the example file:

    ```bash
    cp env/.env.example env/.env.dev
    ```

2. Configure your variables in `env/.env.dev`:

    ```bash
    # DemoWebShop URL
    DEMO_WEBSHOP_URL=https://demowebshop.tricentis.com
    ```

### Switching Environments

```bash
# Default (dev)
npm test

# Staging environment
ENVIRONMENT=staging npm test

# Production environment (read-only tests)
ENVIRONMENT=prod npm test
```

### Creating New Environments

Create `env/.env.<environment>` files:

- `env/.env.dev` - Development
- `env/.env.staging` - Staging
- `env/.env.prod` - Production

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode (Playwright Inspector)
npm run test:debug

# Run with UI mode (interactive)
npm run test:ui
```

### Test Tags

Tests are tagged for selective execution:

```bash
# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run E2E tests only
npm run test:e2e
```

### CI Mode

Optimized for CI environments with single worker and blob reports:

```bash
npm run test:ci
```

### View Reports

```bash
npm run report
```

## Code Quality

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Formatting

```bash
npm run format
```

### Pre-commit Hooks

Husky automatically runs on staged files before each commit:

- ESLint with auto-fix
- Prettier formatting
