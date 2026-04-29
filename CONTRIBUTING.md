# Contributing to YieldSafe Frontend

Thank you for your interest in contributing to **YieldSafe Frontend**. This guide explains, step by step, how to contribute successfully to this project even if this is your first time contributing to an open-source repository on GitHub.

This repository is built with **Next.js** and uses **npm** as its package manager.

Before any Pull Request (PR) can be reviewed and merged, it must pass the repository's automated **GitHub CI checks**:

- `npm run lint`
- `npm run build`

That means contributors are expected to test their changes locally before submitting.

---

# Contribution Overview

The contribution process has two parts:

1. **One-Time Setup** → Done only once when preparing your machine.
2. **Contribution Workflow** → Done every single time you want to work on a new task.

---

# Part 1 — One-Time Setup (Do This Only Once)

## Step 1: Install Required Tools

Make sure the following are installed on your computer:

- **Git** → used for version control
- **Node.js v20 or later**
- **npm** → comes with Node.js
- **A Code Editor** such as VS Code
- **A GitHub account**

You can confirm installation by running:

```bash
git --version
node -v
npm -v
```

---

## Step 2: Fork the Repository

Because you do not have direct write access to the main organization repository, you must create your own copy.

1. Go to the project repository:
   `https://github.com/YieldSafe/ys-frontend`
2. Click the **Fork** button at the top-right corner.
3. GitHub will create a copy under your own GitHub account.

Example:

```bash
https://github.com/YOUR-USERNAME/ys-frontend
```

---

## Step 3: Clone Your Fork to Your Computer

Open your terminal and run:

```bash
git clone https://github.com/YOUR-USERNAME/ys-frontend.git
```

Then move into the project folder:

```bash
cd ys-frontend
```

---

## Step 4: Connect the Original Repository as Upstream

This helps you pull future updates from the official YieldSafe repository.

Run:

```bash
git remote add upstream https://github.com/YieldSafe/ys-frontend.git
```

Confirm remotes:

```bash
git remote -v
```

You should see:

- `origin` → your fork
- `upstream` → official YieldSafe repository

---

## Step 5: Install Project Dependencies

Run:

```bash
npm install
```

This installs all required project packages.

---

## Step 6: Start the Development Server

Run:

```bash
npm run dev
```

This allows you preview the application locally while working.

---

**You are now fully set up.**

Everything above is usually done only once.

---

---

# Part 2 — Contribution Workflow (Do This For Every New Task)

Whenever you are assigned a new issue/task, follow this exact workflow.

---

## Step 1: Make Sure Your Local `develop` Branch is Updated

First switch to the `develop` branch:

```bash
git checkout develop
```

Pull the latest changes from the official repository:

```bash
git pull upstream develop
```

This prevents you from working on outdated code.

---

## Step 2: Create a New Branch for Your Task

Never work directly on `main` or `develop`.

Create a new branch named after your task:

```bash
git checkout -b feature/your-task-name
```

Examples:

```bash
git checkout -b feature/navbar-ui
git checkout -b fix/login-validation
git checkout -b chore/footer-update
```

Each task must have its own separate branch.

---

## Step 3: Implement Your Assigned Task

Open the project in your code editor and make the requested changes.

As you work:

- save your files
- check the browser regularly
- confirm the feature behaves correctly

---

## Step 4: Run Local Quality Checks (Very Important)

Before committing anything, you must run the same checks GitHub Actions will run.

### Run lint check

```bash
npm run lint
```

This checks for code style errors and warnings.

### Run production build check

```bash
npm run build
```

This confirms the app builds successfully.

> If any of these commands fail, your Pull Request will likely fail CI and will not be merged until fixed.

Do not skip this step.

---

## Step 5: Stage Your Changes

After confirming everything works:

```bash
git add .
```

This prepares all modified files for commit.

---

## Step 6: Commit Your Work

Write a clear commit message describing what you changed.

```bash
git commit -m "feat: implemented navbar responsiveness"
```

Other examples:

```bash
git commit -m "fix: corrected login form validation"
git commit -m "chore: updated footer links"
```

Use short and meaningful messages.

---

## Step 7: Push Your Branch to Your Fork

Run:

```bash
git push origin feature/your-task-name
```

This uploads your work to your GitHub fork.

---

## Step 8: Open a Pull Request (PR)

1. Go to your fork on GitHub.

2. GitHub will show a **Compare & Pull Request** button.

3. Click it.

4. Ensure:
    - **base repository** = `YieldSafe/ys-frontend`
    - **base branch** = `develop`
    - **compare branch** = your feature branch

5. Add a PR title that clearly describes your task.

Example:

```bash
feat: completed navbar responsiveness task
```

6. In the PR description, explain briefly what was done.

Then submit the Pull Request.

---

## Step 9: Wait for GitHub CI Checks to Complete

Once the PR is opened, GitHub automatically runs:

- Lint Check
- Build Check

Your PR must show all checks as **passing** before maintainers can review and merge.

If checks fail:

- read the error message
- fix the issue locally
- commit again
- push again

The PR updates automatically.

---

## Step 10: Make Requested Changes if Reviewers Ask

Sometimes maintainers may request:

- UI adjustments
- code cleanup
- bug fixes
- naming changes

Simply make the corrections on the same branch, then run:

```bash
git add .
git commit -m "fix: addressed review comments"
git push origin feature/your-task-name
```

Your PR updates automatically.

---

## Step 11: After Merge, Prepare for Your Next Task

Once your PR is merged:

Switch back to `develop`:

```bash
git checkout develop
```

Pull latest updates:

```bash
git pull upstream develop
```

Then start a fresh branch for your next assigned contribution.

---

---

# Important Rules for All Contributors

- Do not work directly on `main`
- Do not work directly on `develop`
- Always create a new branch per task
- Always run `npm run lint`
- Always run `npm run build`
- Always submit PRs into `develop`
- Do not submit multiple unrelated tasks in one PR
- Ensure your code is tested before pushing

---

# Quick Command Reference

## One-Time Commands

```bash
git clone https://github.com/YOUR-USERNAME/ys-frontend.git
cd ys-frontend
git remote add upstream https://github.com/YieldSafe/ys-frontend.git
npm install
npm run dev
```

---

## Every New Contribution

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-task-name
# work on your task
npm run lint
npm run build
git add .
git commit -m "feat: describe your work"
git push origin feature/your-task-name
```

---

# Need Help?

If you get stuck at any point:

- ask questions in the contributor group chat
- share screenshots of errors if possible
- do not guess when Git shows errors you do not understand

It is completely normal to ask for clarification during your first few contributions.

---

Happy Contributing
