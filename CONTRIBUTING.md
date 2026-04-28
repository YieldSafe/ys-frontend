# Contributing to YieldSafe Frontend

Thank you for your interest in contributing to YieldSafe! This guide will help you get started.

## Contribution Workflow

1. **Fork the Repository**: Click the "Fork" button on GitHub to create your personal copy
2. **Clone Your Fork**:

```bash
git clone https://github.com/YOUR_USERNAME/ys-frontend.git
cd ys-frontend
```

3. **Create a Feature Branch:**

```bash
git checkout -b feature/your-feature-name
```

4. **Make Your Changes:** Implement your feature or fix

5. **Test Your Changes:**

```bash
npm install
npm run lint
npm run build
```

6. **Commit Your Changes:**

```bash
git commit -m "Add your meaningful commit message"
```

7. **Push to Your Fork:**

```bash
git push origin feature/your-feature-name
```

8. **Create a Pull Request:** Go to the main repository and create a PR from your fork to the main branch

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the development server.

## Code Style

We use ESLint for code linting. Ensure your code passes:

```bash
npm run lint
```

- We use TypeScript. All code should be properly typed
- We use Tailwind CSS for styling

## Pull Request Guidelines

- Keep PRs focused and reasonably sized
- Write clear PR descriptions explaining the changes
- Reference any related issues
- Ensure all checks pass (linting, builds)
- Be responsive to review feedback

## Code of Conduct

Please be respectful and constructive in all interactions with other contributors.

## Questions?

Feel free to open an issue to ask questions or start a discussion!

---
